import { test, expect, type Page } from '@playwright/test';
import { env } from './lib/env';
import { shot } from './lib/shot';
import { latestApplyRun, listNodes, waitForApplyRun } from './lib/api';

// Walks the setup wizard on a freshly installed daemon and captures every
// step. Expects: exactly one (local) node registered, no roles assigned, and a
// second machine reachable at NODE_HOST that already trusts the daemon's
// managed SSH key. With DEPLOY=1 the final step starts a real deployment.

const body = (page: Page) => page.locator('body').innerText();

async function settle(page: Page, re: RegExp, maxSeconds = 600) {
  for (let i = 0; i < maxSeconds; i++) {
    if (!re.test(await body(page))) return;
    await page.waitForTimeout(1000);
  }
  throw new Error(`still matching ${re} after ${maxSeconds}s`);
}

test.describe.serial('setup wizard', () => {
  test('nodes step and adding a node', async ({ page, request }) => {
    const nodes = await listNodes(request);
    expect(nodes.filter((n) => n.name !== env.node.name)).toHaveLength(1);

    await page.goto('/setup');
    await expect(page.getByText('Select Nodes')).toBeVisible();
    await shot(page, 'gui', 'setup-wizard-01-nodes');

    await page.getByRole('button', { name: 'Add Node' }).click();
    const dialog = page.locator('div.fixed').filter({ hasText: 'Add Node' }).last();
    await expect(dialog.getByText('Authentication')).toBeVisible();
    await shot(page, 'gui', 'adding-nodes-01-dialog');

    // Password tab, for the alternative flow.
    await dialog.getByRole('button', { name: 'Password' }).click();
    await shot(page, 'gui', 'adding-nodes-02-dialog-password');
    await dialog.getByRole('button', { name: 'SSH key' }).click();

    if (env.node.host) {
      await dialog.getByPlaceholder('e.g. worker-1').fill(env.node.name);
      await dialog.getByPlaceholder(/192\.168\.1\.100/).fill(env.node.host);
      await shot(page, 'gui', 'adding-nodes-03-dialog-filled');
      await dialog.getByRole('button', { name: 'Add & Verify' }).click();
      await expect(page.getByText(/Adding .* · /)).toBeVisible();
      await page.waitForTimeout(4000);
      await shot(page, 'gui', 'adding-nodes-04-progress');
      // The dialog closes itself when registration, agent install, and the
      // preflight pass finish; that takes about a minute.
      await expect(page.getByText(/Adding .* · /)).toBeHidden({ timeout: 5 * 60_000 });
      await expect(page.getByText(env.node.name)).toBeVisible();
      await shot(page, 'gui', 'adding-nodes-05-two-nodes');
    }
  });

  test('preflight step', async ({ page }) => {
    await page.goto('/setup');
    // The wizard resumes at the first incomplete step, so this may land on
    // Nodes (first run) or directly on Preflight (re-run).
    if (await page.getByText('Select Nodes').isVisible().catch(() => false)) {
      await page.getByRole('button', { name: 'Continue' }).click();
    }
    await expect(page.getByText('Preflight Checks')).toBeVisible();
    await page.waitForTimeout(3000);
    await settle(page, /Checking\.\.\.|Running\.\.\./);
    await shot(page, 'gui', 'setup-wizard-02-preflight', { fullPage: true });

    const fixAll = page.getByRole('button', { name: /^Fix All \(/ });
    if (await fixAll.count()) {
      await fixAll.first().click();
      await expect(page.getByText('Fix All Issues')).toBeVisible();
      await shot(page, 'gui', 'setup-wizard-03-preflight-fix-confirm');
      await page.getByRole('button', { name: 'Fix All', exact: true }).click();
      await expect(page.getByText(/\d+ fixed, \d+ failed/)).toBeVisible({ timeout: 5 * 60_000 });
      await shot(page, 'gui', 'setup-wizard-04-preflight-fix-result');
      await page.getByRole('button', { name: 'Close' }).click();
    }

    await page.getByRole('button', { name: 'Re-check All' }).click();
    await page.waitForTimeout(3000);
    await settle(page, /Checking\.\.\.|Running\.\.\.|SSH Pending/);
    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
    await shot(page, 'gui', 'setup-wizard-05-preflight-passed');
  });

  test('roles step', async ({ page }) => {
    await page.goto('/setup');
    await page.waitForTimeout(2000);
    if (await page.getByText('Preflight Checks').isVisible().catch(() => false)) {
      // A reload forgets the SSH verification result; it has to be re-run.
      if (await page.getByText('SSH Pending').count()) {
        await page.getByRole('button', { name: 'Re-check All' }).click();
        await page.waitForTimeout(3000);
      }
      await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled({ timeout: 5 * 60_000 });
      await page.getByRole('button', { name: 'Continue' }).click();
    }
    await expect(page.getByRole('heading', { name: 'Assign Roles' })).toBeVisible();
    await shot(page, 'gui', 'setup-wizard-06-roles', { fullPage: true });

    // First "master" card belongs to the local node; second "gnbsim" card to
    // the added node.
    await page.getByText('master', { exact: true }).nth(0).click();
    await page.waitForTimeout(800);
    if (env.node.host) {
      await page.getByText('gnbsim', { exact: true }).nth(1).click();
      await page.waitForTimeout(800);
    }
    await shot(page, 'gui', 'setup-wizard-07-roles-assigned', { fullPage: true });
    await shot(page, 'gui', 'roles-01-master-exclusive', {
      locator: page.getByText('Only one node can hold this role').locator('..').locator('..'),
    });
  });

  test('config step', async ({ page }) => {
    await page.goto('/setup');
    await expect(page.getByRole('heading', { name: 'Assign Roles' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('heading', { name: 'Review Configuration' })).toBeVisible();
    await expect(page.getByText(/defaults applied from your node configuration/)).toBeVisible({ timeout: 60_000 });
    await shot(page, 'gui', 'setup-wizard-08-config');
    await page.getByText('5G Core', { exact: true }).click();
    await page.waitForTimeout(600);
    await shot(page, 'gui', 'setup-wizard-09-config-core', { fullPage: true });
  });

  test('deploy step', async ({ page, request }) => {
    test.setTimeout(2 * 60 * 60_000);
    await page.goto('/setup');
    await expect(page.getByRole('heading', { name: 'Review Configuration' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Deployment Summary')).toBeVisible();
    await shot(page, 'gui', 'setup-wizard-10-deploy-summary');

    test.skip(!env.deploy, 'set DEPLOY=1 to run the real deployment');
    // Starting the deployment leaves the wizard: the app switches to the
    // dashboard and shows progress in a banner across the top.
    await page.getByRole('button', { name: 'Start Deployment' }).click();
    await page.waitForURL(/\/dashboard/);
    await expect(page.getByText(/^Deploying: /)).toBeVisible();
    await page.waitForTimeout(20_000);
    await shot(page, 'gui', 'setup-wizard-11-deploy-banner');
    await page.goto('/dashboard/deployment');
    await expect(page.getByText('installing')).toBeVisible();
    await shot(page, 'gui', 'setup-wizard-12-deploy-installing');
    const run = await latestApplyRun(request);
    await waitForApplyRun(request, run.id);
    await page.goto('/dashboard');
    await page.waitForTimeout(20_000);
    await shot(page, 'gui', 'setup-wizard-13-deploy-complete', { fullPage: true });
  });
});

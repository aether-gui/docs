import { test, expect, type Page } from '@playwright/test';
import { shot } from './lib/shot';
import { waitForTask } from './lib/api';

// Captures the 5G Network pages (Core tabs, UEs & Subscribers tabs) and the
// Backup & Restore page on a deployed system. Runs the gNBSim simulation from
// Operational Actions first so the live pages have registered UEs.

async function coreTab(page: Page, name: string) {
  await page.getByRole('button', { name, exact: true }).first().click();
  await page.waitForTimeout(3000);
}

test.describe.serial('5G network', () => {
  test('operational actions and gNBSim run', async ({ page, request }) => {
    await page.goto('/dashboard/5g/core');
    await expect(page.getByRole('heading', { name: '5G Core' })).toBeVisible();
    await coreTab(page, 'Components');
    await shot(page, 'gui', '5g-network-01-core-components');

    await coreTab(page, 'Operational Actions');
    await shot(page, 'gui', '5g-network-02-operational-actions', { fullPage: true });

    const row = page.locator('tr').filter({ hasText: 'gnbsim' }).filter({ hasText: 'run' }).first();
    await row.getByRole('button', { name: 'Run' }).click();
    await expect(page.getByText('Run gnbsim run?')).toBeVisible();
    await shot(page, 'gui', '5g-network-03-run-confirm');
    await page.getByRole('button', { name: 'Run action' }).click();
    await page.waitForTimeout(8000);
    await shot(page, 'gui', '5g-network-04-task-output', { fullPage: true });

    const tasks = (await (await request.get('/api/v1/onramp/tasks')).json()) as Array<Record<string, any>>;
    const run = tasks.find((t) => t.component === 'gnbsim' && t.action === 'run');
    if (run) await waitForTask(request, run.id, { timeoutMs: 10 * 60_000, everyMs: 5000 });
  });

  test('live pages while UEs are registered', async ({ page, request }) => {
    // gNBSim registers its UEs a few seconds after the run task returns.
    for (let i = 0; i < 24; i++) {
      const ues = (await (await request.get('/api/v1/deployments/dep-default/sdcore/registered-ues')).json()) as unknown[];
      if (Array.isArray(ues) && ues.length > 0) break;
      await page.waitForTimeout(5000);
    }
    await page.goto('/dashboard/5g/core');
    await coreTab(page, 'Live UEs');
    await shot(page, 'gui', '5g-network-05-live-ues');
    await page.getByRole('button', { name: 'Details' }).first().click().catch(() => {});
    await page.waitForTimeout(1500);
    await shot(page, 'gui', '5g-network-06-ue-details');
    await page.keyboard.press('Escape');

    await coreTab(page, 'gNBs');
    await shot(page, 'gui', '5g-network-07-gnbs');
    await coreTab(page, 'NF Health');
    await shot(page, 'gui', '5g-network-08-nf-health');
    await coreTab(page, 'UPF Counters');
    await shot(page, 'gui', '5g-network-09-upf-counters', { fullPage: true });

    await page.goto('/dashboard/status/network');
    await page.waitForTimeout(3000);
    await shot(page, 'gui', 'status-pages-01-5g-network');
  });

  test('subscribers, device groups, and slices', async ({ page }) => {
    await page.goto('/dashboard/5g/ues');
    await expect(page.getByRole('heading', { name: 'UEs & Subscribers' })).toBeVisible();
    await page.waitForTimeout(3000);
    await shot(page, 'gui', '5g-network-10-subscribers');

    await page.getByRole('button', { name: 'Add Subscriber' }).click();
    await page.waitForTimeout(800);
    await shot(page, 'gui', '5g-network-11-add-subscriber');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Details' }).first().click();
    await page.waitForTimeout(1500);
    await shot(page, 'gui', '5g-network-12-subscriber-details');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Device Groups', exact: true }).click();
    await page.waitForTimeout(2500);
    await shot(page, 'gui', '5g-network-13-device-groups');

    await page.getByRole('button', { name: 'Network Slices', exact: true }).click();
    await page.waitForTimeout(2500);
    await shot(page, 'gui', '5g-network-14-network-slices');
  });

  test('backup and restore', async ({ page }) => {
    await page.goto('/dashboard/operations/backup');
    await expect(page.getByRole('heading', { name: 'Backup & Restore' })).toBeVisible();
    await page.waitForTimeout(3000);
    await shot(page, 'gui', 'backup-restore-01-page', { fullPage: true });
    await page.getByRole('button', { name: 'Check drift' }).click();
    await page.waitForTimeout(6000);
    await shot(page, 'gui', 'backup-restore-02-drift', { fullPage: true });
  });
});

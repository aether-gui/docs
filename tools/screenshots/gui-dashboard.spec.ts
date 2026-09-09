import { test, expect } from '@playwright/test';
import { shot } from './lib/shot';

// Captures the dashboard pages of a deployed system: overview, deployment tab,
// topology, and the status pages. Run after the wizard's deployment finished.

test.describe('dashboard', () => {
  test('overview and navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
    await page.waitForTimeout(3000);
    await shot(page, 'gui', 'tour-01-overview', { fullPage: true });
    await shot(page, 'gui', 'tour-02-sidebar', { locator: page.locator('nav').first() });
    await shot(page, 'gui', 'tour-03-header', {
      locator: page.locator('header').first(),
    });
  });

  test('deployment tab', async ({ page }) => {
    await page.goto('/dashboard/deployment');
    await expect(page.getByRole('heading', { name: 'Deployment' })).toBeVisible();
    await page.waitForTimeout(2000);
    await shot(page, 'gui', 'deployment-tab-01-nodes', { fullPage: true });

    await page.getByRole('button', { name: 'Edit roles' }).first().click();
    await page.waitForTimeout(800);
    await shot(page, 'gui', 'deployment-tab-02-edit-roles');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Bulk Deploy' }).click();
    await page.waitForTimeout(800);
    await shot(page, 'gui', 'deployment-tab-03-bulk-deploy');
    await page.keyboard.press('Escape');
  });

  test('topology', async ({ page }) => {
    await page.goto('/dashboard/topology');
    await expect(page.getByRole('heading', { name: 'Topology' })).toBeVisible();
    await page.waitForTimeout(2500);
    await shot(page, 'gui', 'tour-04-topology', { fullPage: true });
  });

  test('status pages', async ({ page }) => {
    for (const [slug, name, heading] of [
      ['network', 'status-pages-01-5g-network', '5G Network Status'],
      ['kubernetes', 'status-pages-02-kubernetes', 'Kubernetes Status'],
      ['infrastructure', 'status-pages-03-infrastructure', 'Infrastructure Status'],
    ] as const) {
      await page.goto(`/dashboard/status/${slug}`);
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
      await page.waitForTimeout(3000);
      await shot(page, 'gui', name, { fullPage: true });
    }
    // Per-node drill-down from the infrastructure page.
    await page.goto('/dashboard/status/infrastructure');
    await page.waitForTimeout(2000);
    const firstNode = page.locator('table tbody tr').first();
    if (await firstNode.count()) {
      await firstNode.click();
      await page.waitForTimeout(2500);
      if (page.url().includes('/status/infrastructure/')) {
        await shot(page, 'gui', 'status-pages-04-node-detail', { fullPage: true });
      }
    }
  });
});

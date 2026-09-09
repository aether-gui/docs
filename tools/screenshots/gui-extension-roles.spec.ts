import { test, expect } from '@playwright/test';
import { shot } from './lib/shot';

// Captures the extension-role flow in the Deployment tab's role editor. Needs
// the daemon started with the splunk-enterprise and otel-collector feature
// gates enabled; the test skips with a message otherwise. It assigns Splunk
// Enterprise to the first node, opens its values form, and removes the role
// again without installing anything.

test('extension roles in the role editor', async ({ page, request }) => {
  const features = await (await request.get('/api/v1/meta/features')).json();
  test.skip(
    !features.enabled?.includes('splunk-enterprise'),
    'enable the splunk-enterprise and otel-collector feature gates first',
  );

  await page.goto('/dashboard/deployment');
  await page.getByRole('button', { name: 'Edit roles' }).first().click();
  await expect(page.getByText('EXTENSION ROLES')).toBeVisible();
  await shot(page, 'gui', 'extension-roles-01-role-editor', { fullPage: true });

  // Splunk Enterprise is the last role in the editor, so its Add button is the
  // last one on the page.
  await page.getByRole('button', { name: 'Add', exact: true }).last().click();
  await expect(page.getByRole('button', { name: 'Configure' })).toBeVisible({ timeout: 15_000 });
  await shot(page, 'gui', 'extension-roles-02-assigned', {
    locator: page.getByText('EXTENSION ROLES').locator('..'),
  });

  await page.getByRole('button', { name: 'Configure' }).click();
  await expect(page.getByRole('button', { name: 'Derive' })).toBeVisible();
  await shot(page, 'gui', 'extension-roles-03-values-form', { fullPage: true });

  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Configure' })).toBeHidden();
});

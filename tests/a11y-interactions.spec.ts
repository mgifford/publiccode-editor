import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function checkA11y(page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();

  expect(results.violations).toEqual([]);
}

test('home page has no axe violations on load', async ({ page }) => {
  await page.goto('/');
  await checkA11y(page);
});

test('copy and download actions remain accessible', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Copy to clipboard')).toBeVisible();
  await checkA11y(page);

  await page.getByText('Copy to clipboard').click();
  await checkA11y(page);

  await expect(page.getByText('Download')).toBeVisible();
  await page.getByText('Download').click();
  await checkA11y(page);
});
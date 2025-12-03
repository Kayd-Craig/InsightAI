import { test, expect } from '@playwright/test';

test.describe('Example Basic Test', () => {
  test('example test - check Playwright is working', async ({ page }) => {
    // Navigate to a basic web page
    await page.goto('https://playwright.dev');
    
    // Check the title
    await expect(page).toHaveTitle(/Playwright/);
    
    // Check for the get started link
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  });
});
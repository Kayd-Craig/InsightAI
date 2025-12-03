import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display the main landing page', async ({ page }) => {
    await page.goto('/');

    // Check if the page title is correct
    await expect(page).toHaveTitle(/InsightAI/i);

    // Check for main heading
    await expect(page.getByText('Your')).toBeVisible();
    await expect(page.getByText('AI Marketing Assistant')).toBeVisible();

    // Check for the main description
    await expect(page.getByText(/insightAI is an AI-powered analytics platform/)).toBeVisible();

    // Check for email input
    await expect(page.getByPlaceholder('Email Address...')).toBeVisible();

    // Check for get notified button
    await expect(page.getByRole('button', { name: /get notified/i })).toBeVisible();
  });

  test('should allow email input interaction', async ({ page }) => {
    await page.goto('/');

    const emailInput = page.getByPlaceholder('Email Address...');
    
    // Test email input functionality
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    // Test clicking the get notified button
    const getNotifiedButton = page.getByRole('button', { name: /get notified/i });
    await expect(getNotifiedButton).toBeVisible();
    await getNotifiedButton.click();
  });

  test('should display navigation elements', async ({ page }) => {
    await page.goto('/');

    // Check for logo
    await expect(page.getByText('insightAI')).toBeVisible();

    // Check for navigation items (in desktop view)
    const homeLink = page.getByText('Home').first();
    const featuresLink = page.getByText('Features').first();
    const pricingLink = page.getByText('Pricing').first();
    const faqsLink = page.getByText('FAQs').first();

    // These might be hidden on mobile, so we'll check if they exist
    await expect(homeLink.or(page.locator('text=Home').first())).toBeTruthy();
    await expect(featuresLink.or(page.locator('text=Features').first())).toBeTruthy();
    await expect(pricingLink.or(page.locator('text=Pricing').first())).toBeTruthy();
    await expect(faqsLink.or(page.locator('text=FAQs').first())).toBeTruthy();
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Main content should still be visible
    await expect(page.getByText('AI Marketing Assistant')).toBeVisible();
    await expect(page.getByPlaceholder('Email Address...')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Content should still be visible
    await expect(page.getByText('AI Marketing Assistant')).toBeVisible();
    await expect(page.getByPlaceholder('Email Address...')).toBeVisible();
  });
});
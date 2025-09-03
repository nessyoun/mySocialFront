import { test, expect } from '@playwright/test';

test.describe('Activities Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@ocpgroup.ma');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
    
    // Navigate to activities
    await page.click('text=Activités');
    await page.waitForURL('/activites');
  });

  test('should display activities list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Activités');
    await expect(page.locator('.p-datatable')).toBeVisible();
  });

  test('should filter activities by module', async ({ page }) => {
    await page.click('[data-testid="module-filter"]');
    await page.click('text=Récréatives');
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Check that only recreatives activities are shown
    await expect(page.locator('text=Récréatives')).toBeVisible();
  });

  test('should navigate to activity detail', async ({ page }) => {
    await page.click('.p-datatable tbody tr:first-child');
    await expect(page.url()).toMatch(/\/activites\/\d+/);
  });

  test('should start inscription wizard', async ({ page }) => {
    // Go to activity detail
    await page.click('.p-datatable tbody tr:first-child');
    
    // Check if inscription button is available
    const inscriptionButton = page.locator('text=Commencer l\'inscription');
    if (await inscriptionButton.isVisible()) {
      await inscriptionButton.click();
      await expect(page.url()).toMatch(/\/activites\/\d+\/inscription/);
      await expect(page.locator('.p-steps')).toBeVisible();
    }
  });
});
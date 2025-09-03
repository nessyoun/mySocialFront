import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'admin@ocpgroup.ma');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should display KPI cards', async ({ page }) => {
    await expect(page.locator('text=Total demandes')).toBeVisible();
    await expect(page.locator('text=En attente')).toBeVisible();
    await expect(page.locator('text=Activités actives')).toBeVisible();
    await expect(page.locator('text=Utilisateurs actifs')).toBeVisible();
  });

  test('should navigate to activities page', async ({ page }) => {
    await page.click('text=Activités');
    await expect(page).toHaveURL('/activites');
    await expect(page.locator('h1')).toContainText('Activités');
  });

  test('should show admin menu for admin users', async ({ page }) => {
    await page.click('text=Administration');
    await expect(page).toHaveURL('/admin');
    await expect(page.locator('text=Gestion des utilisateurs')).toBeVisible();
  });
});
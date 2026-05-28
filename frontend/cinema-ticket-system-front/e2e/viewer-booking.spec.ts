import { expect, test } from '@playwright/test';

test.describe('Viewer booking', () => {
  test('books seats and shows reservation code', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /repertuar/i })).toBeVisible();

    await page.getByTestId('buy-ticket-btn').first().click();
    await expect(page.getByRole('heading', { name: 'Wybierz miejsca' })).toBeVisible();

    const availableSeats = page.locator('[data-testid^="seat-"]:not([disabled])');
    await availableSeats.nth(0).click();
    await availableSeats.nth(1).click();
    await page.getByTestId('confirm-reservation').click();

    const code = page.getByTestId('reservation-code');
    await expect(code).toBeVisible();
    await expect(code).toHaveText(/^RES-/);
  });
});

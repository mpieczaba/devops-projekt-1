import { expect, test } from '@playwright/test';

test.describe('Viewer booking', () => {
  test('books seats and shows reservation code', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /repertuar/i })).toBeVisible();

    await page.getByTestId('buy-ticket-btn').first().click();
    await expect(page.getByRole('heading', { name: 'Wybierz miejsca' })).toBeVisible();

    await page.getByTestId('seat-1').click();
    await page.getByTestId('seat-2').click();
    await page.getByTestId('confirm-reservation').click();

    const code = page.getByTestId('reservation-code');
    await expect(code).toBeVisible();
    await expect(code).toHaveText(/^RES-/);
  });
});

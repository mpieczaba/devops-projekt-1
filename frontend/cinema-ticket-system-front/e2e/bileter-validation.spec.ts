import { expect, test } from '@playwright/test';
import { createValidReservation } from './helpers/api';

test.describe('Bileter validation', () => {
  test('logs in, verifies and redeems a reservation', async ({ page }) => {
    const reservationCode = await createValidReservation();

    await page.goto('/bileter');

    await page.getByTestId('validator-username').fill('a');
    await page.getByTestId('validator-password').fill('p');
    await page.getByTestId('validator-login-submit').click();

    await expect(page.getByRole('heading', { name: 'Weryfikacja biletu' })).toBeVisible();

    await page.getByTestId('reservation-code-input').fill(reservationCode);
    await page.getByTestId('lookup-ticket').click();

    await expect(page.getByTestId('ticket-state')).toHaveText('Ważny');
    await page.getByTestId('redeem-ticket').click();
    await expect(page.getByTestId('ticket-state')).toHaveText('Skasowany');
  });
});

import { test, expect } from '@playwright/test';

test('Validar que la colección "justificaciones" muestre el titulo y un contador numérico', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.getByRole('main')).toContainText('Justificaciones');
  await page.locator('#justificaciones').click();
  await expect(page.locator('#justificaciones')).toContainText('0');
});
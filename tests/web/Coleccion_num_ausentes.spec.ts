import { test, expect } from '@playwright/test';

test('Validar que la colección "Ausentes" muestre el titulo y un contador numérico', async ({ page }) => {
  await page.goto('http://localhost:3000/inicio');
  await expect(page.getByRole('main')).toContainText('Ausentes');
  await expect(page.locator('#ausentes')).toContainText('5');
});

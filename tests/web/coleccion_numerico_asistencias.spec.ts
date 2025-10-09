import { test, expect } from '@playwright/test';

test('Validar que la colección "Asistencias" muestre el titulo y un contador numérico', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.getByRole('main')).toContainText('Asistencias');
  await expect(page.locator('#porcentaje_asistencia')).toContainText('5 / 10');
});

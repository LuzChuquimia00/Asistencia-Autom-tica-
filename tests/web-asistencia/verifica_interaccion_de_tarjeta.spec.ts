import { test, expect } from '@playwright/test';

test('verifica la interaccion de las tarjetas', async ({ page }) => {
  await page.goto('http://localhost:3000/asistencia');
  await expect(page.getByRole('link', { name: 'IMG 1°D' })).toBeVisible();
  await page.getByRole('link', { name: 'IMG 1°D' }).click();
  await page.goto('http://localhost:3000/asistencia/1°D');
  await expect(page.locator('div').filter({ hasText: 'Detalles de la' })).toBeVisible();
  await expect(page.getByText('Mostrando la planilla para el')).toBeVisible();
});
import { test, expect } from '@playwright/test';

test('Error, archivo vacio o con campo vacio', async ({ page }) => {
  await page.goto('http://localhost:3000/carga_masiva');
  await expect(page.getByRole('button', { name: 'Choose File' })).toBeVisible();
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles('./tests/ejemplos-csv/ejem-VACÍO.csv');
  await expect(page.getByRole('button', { name: 'Procesar Archivo' })).toBeVisible();
  await page.getByRole('button', { name: 'Procesar Archivo' }).click();
  await expect(page.getByText('Error de ProcesamientoOcurri')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Entendido' })).toBeVisible();
  await page.getByRole('button', { name: 'Entendido' }).click();
});
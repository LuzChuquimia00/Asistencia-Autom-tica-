import { test, expect } from '@playwright/test';

test('Se subieron los archivos de csv sus datos a pocketbase exitosamente', async ({ page }) => {
  await page.goto('http://localhost:3000/carga_masiva');
  await expect(page.getByRole('button', { name: 'Choose File' })).toBeVisible();
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles('./tests/ejemplos-csv/ejem-otro-USER.csv');
  await expect(page.getByRole('button', { name: 'Procesar Archivo' })).toBeVisible();
  await page.getByRole('button', { name: 'Procesar Archivo' }).click();
  await expect(page.getByRole('button', { name: 'Aceptar y Enviar a PocketBase' })).toBeVisible();
  await page.getByRole('button', { name: 'Aceptar y Enviar a PocketBase' }).click();
  await expect(page.getByText('Se registraron **2**')).toBeVisible();
  await page.getByText('Se registraron **2**').click();
});
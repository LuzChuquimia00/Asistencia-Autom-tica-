import { test, expect } from '@playwright/test';

test('registro fallido, usuario registrado', async ({ page }) => {
  await page.goto('http://localhost:3000/carga_masiva');
  await expect(page.getByRole('button', { name: 'Choose File' })).toBeVisible();
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles('./tests/ejemplos-csv/ejemplo.csv');
  await expect(page.getByRole('button', { name: 'Procesar Archivo' })).toBeVisible();
  await page.getByRole('button', { name: 'Procesar Archivo' }).click();
  await expect(page.getByRole('button', { name: 'Aceptar y Enviar a PocketBase' })).toBeVisible();
  await page.getByRole('button', { name: 'Aceptar y Enviar a PocketBase' }).click();
  await expect(page.getByText('¡Proceso Fallido!Usuario no')).toBeVisible();
  await page.getByText('Usuario no registrado/Usuario').click();
});
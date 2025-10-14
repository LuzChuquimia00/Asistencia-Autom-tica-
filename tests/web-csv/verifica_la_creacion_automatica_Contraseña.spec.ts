import { test, expect } from '@playwright/test';

test('se crea una contrasña automatica antes de ser enviado a pocketbase', async ({ page }) => {
  await page.goto('http://localhost:3000/carga_masiva');
  await expect(page.getByRole('button', { name: 'Choose File' })).toBeVisible();
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles('ejemplo.csv');
  await expect(page.getByRole('button', { name: 'Procesar Archivo' })).toBeVisible();
  await page.getByRole('button', { name: 'Procesar Archivo' }).click();
  await expect(page.locator('tbody')).toContainText('kevinorosco');
});
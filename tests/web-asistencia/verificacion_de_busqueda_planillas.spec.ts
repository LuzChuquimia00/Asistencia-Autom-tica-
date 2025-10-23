import { test, expect } from '@playwright/test';

test( 'Busca a las planillas de tal grado/curso escrito.', async ({ page }) => {
  await page.goto('http://localhost:3000/asistencia');
  await expect(page.getByRole('textbox', { name: 'Buscar Curso...' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Buscar Curso...' }).click();
  await page.getByRole('textbox', { name: 'Buscar Curso...' }).fill('1');
  await expect(page.getByRole('textbox', { name: 'Buscar Curso...' })).toBeVisible();
  await expect(page.getByText('Planilla 1°IMG1°AIMG1°BIMG1°')).toBeVisible();
  await page.getByRole('textbox', { name: 'Buscar Curso...' }).click();
  await page.getByRole('textbox', { name: 'Buscar Curso...' }).fill('1');
  await page.getByRole('textbox', { name: 'Buscar Curso...' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Buscar Curso...' }).fill('1°');
  await page.getByRole('textbox', { name: 'Buscar Curso...' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Buscar Curso...' }).fill('1°a');
  await page.getByRole('textbox', { name: 'Buscar Curso...' }).press('CapsLock');
  await expect(page.getByRole('textbox', { name: 'Buscar Curso...' })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: 'IMG1°A' }).nth(1)).toBeVisible();
});
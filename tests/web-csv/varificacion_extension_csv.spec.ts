import { test, expect } from '@playwright/test';

test('Muestra un cartel de error sobre que no es la extension .csv', async ({ page }) => {
  await page.goto('http://localhost:3000/carga_masiva');
  await expect(page.getByRole('button', { name: 'Choose File' })).toBeVisible();
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles('./tests/ejemplos-csv/trabajo.pdf');
  await expect(page.getByText('Error de FormatoSolo se')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Entendido' })).toBeVisible();
  await page.getByRole('button', { name: 'Entendido' }).click();
});
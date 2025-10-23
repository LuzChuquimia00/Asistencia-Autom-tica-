import { test, expect } from '@playwright/test';

test('funcional de tabla, como columnas', async ({ page }) => {
  await page.goto('http://localhost:3000/asistencia/1°C');
  await expect(page.locator('div').filter({ hasText: 'Detalles de la' })).toBeVisible();
  await expect(page.getByText('Mostrando la planilla para el')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Alumno', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Alumno no encontrado' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Estado' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Present' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Ingreso' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '--:--' })).toBeVisible();
});


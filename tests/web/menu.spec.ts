import { test, expect } from '@playwright/test';

test('testea el titulo del menú, como las colecciones de las demás pestañas', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('banner').getByRole('img').click();
  await expect(page.locator('h2')).toContainText('Menú');
  await expect(page.getByRole('list')).toContainText('Inicio');
  await expect(page.getByRole('list')).toContainText('Alumnos');
  await expect(page.getByRole('list')).toContainText('Asistencias');
  await expect(page.getByRole('list')).toContainText('Asistencias');
  await expect(page.getByRole('list')).toContainText('Justificaciones');
  await expect(page.getByRole('list')).toContainText('Comunicación');
  await expect(page.getByRole('list')).toContainText('Seguridad y Acceso');
  await expect(page.getByRole('list')).toContainText('Seguridad y Acceso');
  await expect(page.getByRole('list')).toContainText('Emergencia');
});
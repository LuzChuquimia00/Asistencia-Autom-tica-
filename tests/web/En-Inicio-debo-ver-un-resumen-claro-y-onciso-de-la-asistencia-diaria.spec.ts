// web/En-Inicio-debo-ver-un-resumen-claro-y-onciso-de-la-asistencia-diaria.spec.ts
import { test, expect } from '@playwright/test';

test('Verificar que el título principal de la página sea Gestion De Inicio y que el subtítulo Resumen general del estado de las asistencias en tiempo real se muestre correctamente', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // 1. Validar el título principal de la página.
    // Usamos un selector preciso para evitar ambigüedad.
    await expect(page.getByRole('heading', { name: 'Geasis de Inicio' })).toBeVisible();

    // 2. Validar el subtítulo.
    await expect(page.getByText('Resumen general del estado de las asistencias en tiempo real.')).toBeVisible();
});
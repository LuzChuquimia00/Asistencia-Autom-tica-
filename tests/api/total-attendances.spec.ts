import { test, expect } from '@playwright/test';
import { getDashboardSummary } from '../utils/pocketbase';

test('El backend puede obtener el total de Asistencias', async () => {
    // El globalSetup crea 5 asistencias con estado 'present'.
    const expectedPresent = 5;

    const summaryData = await getDashboardSummary();
    const summaryRecord = summaryData.items[0];

    // Validamos el conteo de presentes.
    expect(summaryRecord.present_count).toBe(expectedPresent);
});
import { test, expect } from '@playwright/test';
import { getDashboardSummary } from '../utils/pocketbase';

test('El backend puede obtener el total de ausentes', async () => {
    // El globalSetup crea 10 estudiantes.
    const totalStudents = 10;
    // El globalSetup crea 5 asistencias.
    const presentCount = 5;
    const expectedAbsent = totalStudents - presentCount;

    const summaryData = await getDashboardSummary();
    const summaryRecord = summaryData.items[0];

    // Validamos que el conteo de ausentes es el esperado del globalSetup.
    expect(summaryRecord.absent_count).toBe(expectedAbsent);
});
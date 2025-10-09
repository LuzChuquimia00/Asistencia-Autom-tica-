// api/justificacion-errores.spec.ts
import { test, expect } from '@playwright/test';
import { consultas } from '../utils/pocketbase';

test('El backend rechaza una justificación sin tipo de justificación y no crea un registro', async () => {
    // 1. Obtén el conteo inicial de justificaciones.
    const initialJustificationsResponse = await consultas.get('/api/collections/management_of_justifications/records');
    const initialJustificationsCount = initialJustificationsResponse.data.items.length;

    // 2. Intenta crear una justificación con el campo 'type' vacío.
    const invalidJustificationResponse = await consultas.post('/api/collections/management_of_justifications/records', {
        student: 'studentId', 
        course: '1°C',
        type: '' // Tipo de justificación vacío
    });

    // 3. Valida que el backend responde con un error 400 (Bad Request).
    expect(invalidJustificationResponse.status).toBe(400);

    // 4. Verifica que el conteo de justificaciones no ha cambiado.
    const justificationsAfterResponse = await consultas.get('/api/collections/management_of_justifications/records');
    expect(justificationsAfterResponse.data.items.length).toBe(initialJustificationsCount);
});
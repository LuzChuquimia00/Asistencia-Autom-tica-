// api/justificacion-errores.spec.ts

import { test, expect } from '@playwright/test';
import { consultas } from '../utils/pocketbase';
import { AxiosError } from 'axios'; // Importa AxiosError para tipado

test('El backend rechaza una justificación sin tipo de justificación y no crea un registro', async () => {
    // 1. Obtén el conteo inicial de justificaciones.
    const initialJustificationsResponse = await consultas.get('/api/collections/management_of_justifications/records');
    const initialJustificationsCount = initialJustificationsResponse.data.items.length;

    let errorResponseStatus: number | undefined;

    // 2. Intenta crear una justificación con el campo 'type' vacío y CAPTURA EL ERROR.
    try {
        await consultas.post('/api/collections/management_of_justifications/records', {
            student: 'studentId', 
            course: ['1°C'], 
            type: '' // Tipo de justificación vacío
        });
        // Si la solicitud tiene éxito (código 2xx), el test debe fallar
        throw new Error('La solicitud POST tuvo éxito, lo cual es inesperado.');

    } catch (error: unknown) {
        // Axios lanza una excepción (AxiosError) al recibir 400.
        if (error instanceof AxiosError) {
            // Guardamos el estado de la respuesta de error 400
            errorResponseStatus = error.response?.status;
        } else {
            // Re-lanza cualquier otro error inesperado.
            throw error;
        }
    }
    // 3. Valida que el backend responde con un error 400 (Bad Request).
    expect(errorResponseStatus).toBe(400);
    // 4. Verifica que el conteo de justificaciones no ha cambiado.
    const justificationsAfterResponse = await consultas.get('/api/collections/management_of_justifications/records');
    expect(justificationsAfterResponse.data.items.length).toBe(initialJustificationsCount);
});
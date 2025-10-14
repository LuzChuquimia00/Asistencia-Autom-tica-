// api/rechazar-datos-falsos.spec.ts

import { test, expect } from '@playwright/test';
import { consultas } from '../utils/pocketbase';
import { AxiosError } from 'axios'; // Necesitas importar AxiosError para manejar el tipo

test('El backend rechaza datos invalidos y mantiene la integridad de la base de datos', async () => {
    // 1. Obtén el conteo inicial de estudiantes.
    const initialStudentsResponse = await consultas.get('/api/collections/students/records');
    const initialStudentsData = initialStudentsResponse.data;
    const initialStudentsCount = initialStudentsData.items.length;

    let errorResponseStatus: number | undefined;

    // 2. Intenta crear un estudiante con un tipo de sangre no válido.
    try {
        await consultas.post('/api/collections/students/records', {
            name: 'Invalid',
            surname: 'User',
            course: '1°C', // REVISA: ¿Es 'course' un campo obligatorio en PocketBase? Si no, puede ser la causa del 400.
            date: '2000-01-01', // REVISA: 'date' (fecha de nacimiento) es obligatorio en tu setup.
            blood_type: 'Z+' // Tipo de sangre no válido
        });
        
        // Si el POST tiene éxito (código 2xx), el test debe fallar, ya que esperas un error.
        throw new Error('La creación del estudiante tuvo éxito, lo cual es inesperado.');

    } catch (error: unknown) {
        // Axios lanza un error al recibir 400.
        if (error instanceof AxiosError) {
            // Guardamos el estado de la respuesta (debería ser 400)
            errorResponseStatus = error.response?.status;
            
            // Opcional: Imprime el error para depurar qué campo falló (ej: tipo de sangre, o campo faltante)
            // console.log("Detalle del error 400:", error.response?.data.data);
        } else {
            // Re-lanza cualquier otro error (ej: red, timeout)
            throw error;
        }
    }
    
    // 3. Verifica que la petición falló con el código 400.
    expect(errorResponseStatus).toBe(400);
    // 4. Verifica que el conteo de estudiantes no ha cambiado.
    const studentsAfterResponse = await consultas.get('/api/collections/students/records');
    const studentsAfterData = studentsAfterResponse.data;
    expect(studentsAfterData.items.length).toBe(initialStudentsCount);
});
// api/rechazar-datos-falsos.spec.ts
import { test, expect } from '@playwright/test';
import { consultas } from '../utils/pocketbase'; // Asegúrate de importar 'consultas'

test('El backend rechaza datos invalidos y mantiene la integridad de la base de datos', async () => {
    // 1. Obtén el conteo inicial de estudiantes usando tu cliente de PocketBase.
    const initialStudentsResponse = await consultas.get('/api/collections/students/records');
    const initialStudentsData = initialStudentsResponse.data;
    const initialStudentsCount = initialStudentsData.items.length;

    // 2. Intenta crear un estudiante con un tipo de sangre no válido.
    const invalidStudentResponse = await consultas.post('/api/collections/students/records', {
        name: 'Invalid',
        surname: 'User',
        course: '1°C',
        blood_type: 'Z+'
    });
    
    // Verifica que la petición falle (status 400 = Bad Request).
    expect(invalidStudentResponse.status).toBe(400);

    // 3. Verifica que el conteo de estudiantes no ha cambiado.
    const studentsAfterResponse = await consultas.get('/api/collections/students/records');
    const studentsAfterData = studentsAfterResponse.data;
    expect(studentsAfterData.items.length).toBe(initialStudentsCount);
});
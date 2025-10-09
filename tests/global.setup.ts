// globalSetup.ts

import { FullConfig } from '@playwright/test';
import { clearCollections, createStudents, createAttendance } from './utils/pocketbase';

/**
 * Función que se ejecuta una vez antes de todos los tests.
 * Se encarga de limpiar la base de datos y subir los datos de prueba.
 * @param config La configuración de Playwright.
 */
async function globalSetup(config: FullConfig) {
    console.log('Ejecutando globalSetup: Preparando la base de datos para los tests...');

    // Limpia todas las colecciones relevantes antes de sembrar nuevos datos.
    const collectionsToClear = ['students', 'attendance_management', 'management_of_justifications'];
    await clearCollections(collectionsToClear);

    // Sube los datos de prueba.
    console.log('Sembrando datos de prueba...');

    // Crear estudiantes de prueba
    const students = await createStudents(10);
    console.log(`Se crearon ${students.length} estudiantes de prueba.`);

    // Crear registros de asistencia (5 presentes y 5 ausentes)
    for (let i = 0; i < 5; i++) {
        await createAttendance(students[i].id, '1°C', 'present');
        await createAttendance(students[i + 5].id, '1°C', 'absent');
    }
    console.log('Se crearon registros de asistencia.');

    console.log('GlobalSetup completado.');
}

export default globalSetup;

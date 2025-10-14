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

    // 💡 SOLUCIÓN 1: Usa la clase Date tal cual
    // Si la estás llamando 'todayDate', asegúrate de que esté definida correctamente.
    const today = new Date(); 

    // 💡 SOLUCIÓN 2: Obtén el formato ISO de la fecha sin la hora.
    // Esto es más robusto y no usa split().
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Mesi va de 0 a 11
    const day = String(today.getDate()).padStart(2, '0');
    
    // Este es el formato YYYY-MM-DD que necesita PocketBase y SQL (Ej: 2025-10-13)
    const todayDate = `${year}-${month}-${day}`; 
    console.log(`Fecha de asistencia a usar: ${todayDate}`);
    
    // Crear registros de asistencia (5 presentes y 5 ausentes)
    for (let i = 0; i < 5; i++) {
        await createAttendance(students[i].id, '1°C', 'present', todayDate); 
        await createAttendance(students[i + 5].id, '1°C', 'absent', todayDate);
    }

    console.log('Se crearon registros de asistencia.');

    console.log('GlobalSetup completado.');
}

export default globalSetup;

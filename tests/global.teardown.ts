// globalTeardown.ts

import { FullConfig } from '@playwright/test';
import { clearCollections } from './utils/pocketbase';

/**
 * Función que se ejecuta una vez después de que todos los tests han terminado.
 * Se encarga de limpiar la base de datos para dejarla en un estado limpio.
 * @param config La configuración de Playwright.
 */
async function globalTeardown(config: FullConfig) {
    console.log('Ejecutando globalTeardown: Limpiando base de datos...');

    // Limpia todas las colecciones relevantes
    const collectionsToClear = ['students', 'attendance_management', 'management_of_justifications'];
    await clearCollections(collectionsToClear);

    console.log('GlobalTeardown completado. La base de datos está limpia.');
}

export default globalTeardown;
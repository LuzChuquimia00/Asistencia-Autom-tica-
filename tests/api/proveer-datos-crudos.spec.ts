import { test, expect } from '@playwright/test';
import { consultas, createJustification } from '../utils/pocketbase';

test('El backend provee acceso a los datos crudos y es la fuente de verdad', async () => {
    // 1. Validar el conteo de estudiantes.
    const studentsResponse = await consultas.get('/api/collections/students/records');
    const studentsData = studentsResponse.data;
    // El globalSetup crea 10 estudiantes.
    expect(studentsData.items.length).toBe(10);
    
    // 2. Validar el conteo de asistencias.
    const attendanceResponse = await consultas.get('/api/collections/attendance_management/records');
    const attendanceData = attendanceResponse.data;
    // El globalSetup crea 10 asistencias (5 presentes, 5 ausentes).
    expect(attendanceData.items.length).toBe(10);
    
    // 3. Validar el conteo de justificaciones.
    const justificationsResponse = await consultas.get('/api/collections/management_of_justifications/records');
    const justificationsData = justificationsResponse.data;
    // El globalSetup no crea justificaciones.
    expect(justificationsData.items.length).toBe(0);
});
// api/sin-justificar.spec.ts
import { test, expect } from '@playwright/test';
import { createJustification, consultas } from '../utils/pocketbase';

test('El backend mantiene la información de las ausencias sin justificar', async () => {
    // Paso 1: Crear una justificación de tipo "Sin justificar".
    const studentsResponse = await consultas.get('/api/collections/students/records');
    const student = studentsResponse.data.items[0];
    const justification = await createJustification(student.id, '1°C', 'S.J');

    // Paso 2: Obtener todos los registros de ausencias sin justificar.
    const response = await consultas.get('/api/collections/management_of_justifications/records?filter=(type="S.J")');
    const data = response.data;
    
    // Paso 3: Validar que el conteo es el esperado (mayor a cero).
    expect(data.items.length).toBeGreaterThanOrEqual(1);
    expect(data.items.some((item: any) => item.type === 'S.J')).toBeTruthy();

    // Paso 4: Limpiar el registro creado por este test para no afectar a otros tests.
    await consultas.delete(`/api/collections/management_of_justifications/records/${justification.id}`);
});
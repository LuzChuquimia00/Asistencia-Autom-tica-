// utils/pocketbase.ts

import axios, { AxiosInstance } from "axios";

// Define el tipo para los registros de estudiantes
interface Student {
  id: string;
  name: string;
  surname: string;
  date: string;
  blood_type: string;
}

// Define el tipo para los registros de asistencia
interface Attendance {
  id: string;
  student: string;
  state: string;
  course: string[];
}

// Define el tipo para los registros de justificación
export interface Justification {
  id: string;
  student: string;
  course: string[];
  type: string;
  reason: string;
}

// Instancia única de Axios para todas las peticiones a la API de PocketBase
export const consultas: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8090",
  timeout: 5000, // Aumenta el timeout para evitar errores de conexión
});

/**
 * Limpia todos los registros de las colecciones especificadas.
 * @param collections El array de nombres de colecciones a limpiar.
 * @returns Una promesa que se resuelve cuando la limpieza ha terminado.
 */
// utils/pocketbase.ts

export async function clearCollections(collections: string[]): Promise<void> {
  // AÑADIDO: Mensaje de inicio para saber que el proceso comenzó.
  console.log("--- INICIANDO PROCESO DE LIMPIEZA DE DATOS ---");

  for (const collection of collections) {
    try {
      const response = await consultas.get(
        `/api/collections/${collection}/records?perPage=200`
      );
      const recordsToDelete = response.data.items;

      if (recordsToDelete.length > 0) {
        // AÑADIDO: Mensaje más específico sobre cuántos registros se encontraron.
        console.log(
          `[${collection}] Se encontraron ${recordsToDelete.length} registros para eliminar.`
        );

        const deletePromises = recordsToDelete.map((record: any) =>
          consultas.delete(
            `/api/collections/${collection}/records/${record.id}`
          )
        );
        await Promise.all(deletePromises);

        // AÑADIDO: Mensaje de confirmación de la eliminación.
        console.log(
          `[${collection}] Se eliminaron todos los registros exitosamente.`
        );
      } else {
        // AÑADIDO: Mensaje para saber si la colección ya estaba vacía.
        console.log(
          `[${collection}] La colección ya estaba vacía. No hay nada que limpiar.`
        );
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // El error 404 es esperado si la colección no existe
      } else {
        console.error(
          `ERROR: Falló al limpiar la colección '${collection}'.`,
          error
        );
        throw error;
      }
    }
  }
  // AÑADIDO: Mensaje de fin para saber que el proceso terminó.
  console.log("--- PROCESO DE LIMPIEZA COMPLETADO ---");
}

/**
 * Crea un número específico de estudiantes de prueba.
 * @param count El número de estudiantes a crear.
 * @returns Una promesa que se resuelve con un array de estudiantes creados.
 */
export async function createStudents(count: number): Promise<Student[]> {
  const students: Student[] = [];
  const dateOfBirth = new Date().toISOString().split("T")[0]; // Genera una fecha de nacimiento simple
  for (let i = 1; i <= count; i++) {
    const response = await consultas.post("/api/collections/students/records", {
      name: `StudentName${i}`,
      surname: `StudentSurname${i}`,
      curso: "1A",
      date: dateOfBirth,
      blood_type: ["A+"],
    });
    const student: Student = response.data;
    students.push(student);
  }
  return students;
}

/**
 * Crea un registro de asistencia para un estudiante.
 * @param studentId El ID del estudiante.
 * @param course El curso del estudiante.
 * @param state El estado de asistencia ('present' o 'absent').
 * @returns Una promesa que se resuelve con el registro de asistencia creado.
 */
export async function createAttendance(
  studentId: string,
  course: string,
  state: string,
  todayDate: string
): Promise<Attendance> {
  const response = await consultas.post(
    "/api/collections/attendance_management/records",
    {
      student: studentId,
      course: [course],
      state: state,
      date: todayDate,
    }
  );
  return response.data;
}

/**
 * Crea un registro de justificación para un estudiante.
 * @param studentId El ID del estudiante.
 * @param course El curso del estudiante.
 * @param type El tipo de justificación.
 * @returns Una promesa que se resuelve con el registro de justificación creado.
 */
export async function createJustification(
  studentId: string,
  course: string,
  type: string
): Promise<Justification> {
  const response = await consultas.post(
    "/api/collections/management_of_justifications/records",
    {
      student: studentId,
      course: [course],
      type: type,
      reason: "Justificación de prueba",
    }
  );
  return response.data;
}

/**
 * Obtiene el resumen del dashboard.
 * @returns Una promesa que se resuelve con el resumen del dashboard.
 */
export async function getDashboardSummary(): Promise<any> {
  const response = await consultas.get(
    "/api/collections/dashboard_summary/records"
  );
  return response.data;
}

// src/app/(main)/asistencia/[courseId]/columns.tsx

'use client';

import { ColumnDef } from '@tanstack/react-table';

// ✅ CORREGIDO: Interfaz para los datos del estudiante expandido
// Nos aseguramos que coincida con tu schema de PocketBase ("name", "surname")
interface StudentData {
  name: string;
  surname: string;
}

// Interfaz principal para la fila de asistencia
export interface AsistenciaEstudiante {
  id: string;
  ingreso: string;
  state: 'present' | 'absent';
  expand: {
    student: StudentData; // Usamos la interfaz definida arriba
  };
}

export const columns: ColumnDef<AsistenciaEstudiante>[] = [
  {
    accessorKey: 'alumno',
    header: 'Alumno',
    cell: ({ row }) => {
      const student = row.original.expand.student;
      
      // ✅ CORREGIDO: Verificación más robusta
      // Si no hay datos del estudiante O si el nombre o apellido faltan
      if (!student || !student.name) {
        return <span className="text-gray-400">Alumno no encontrado</span>;
      }
      return `${student.name} ${student.surname}`;
    },
  },
  {
    accessorKey: 'state',
    header: 'Estado',
    cell: ({ row }) => {
      const state = row.getValue('state') as string;
      const color = state === 'present' ? 'text-green-600' : 'text-red-600';
      const capitalizedState = state.charAt(0).toUpperCase() + state.slice(1);
      return <span className={`font-semibold ${color}`}>{capitalizedState}</span>;
    },
  },
  {
    accessorKey: 'ingreso',
    header: 'Ingreso',
    cell: ({ row }) => {
      const ingreso = row.getValue('ingreso');
      return ingreso ? ingreso : <span className="text-gray-400">--:--</span>;
    }
  },
];
// src/app/asistencia/[courseId]/columns.tsx

'use client';

import { ColumnDef } from '@tanstack/react-table';

// Definimos la estructura de datos que esperamos de PocketBase
// Coincide con tu esquema: 'attendance_management' con 'student' expandido
export interface AsistenciaEstudiante {
  id: string;
  ingreso: string;
  state: 'present' | 'absent';
  expand: {
    student: {
      name: string;      // Usamos 'name' y 'surname' como en tu schema de 'students'
      surname: string;
      
    };
  };
}

// Aquí definimos cada columna de nuestra tabla
export const columns: ColumnDef<AsistenciaEstudiante>[] = [
  {
    // Columna "Alumno": combina nombre y apellido
    accessorKey: 'alumno',
    header: 'Alumno',
    cell: ({ row }) => {
      const student = row.original.expand.student;
      // Verificamos que los datos del estudiante existan
      if (!student) {
        return <span className="text-gray-400">Sin datos de alumno</span>;
      }
      return `${student.name} ${student.surname}`;
    },
  },
  {
    // Columna "Estado": Muestra si está presente o ausente con colores
    accessorKey: 'state',
    header: 'Estado',
    cell: ({ row }) => {
      const state = row.getValue('state') as string;
      // Asignamos un color diferente según el estado
      const color = state === 'present' ? 'text-green-600' : 'text-red-600';
      const capitalizedState = state.charAt(0).toUpperCase() + state.slice(1);

      return <span className={`font-semibold ${color}`}>{capitalizedState}</span>;
    },
  },
  {
    // Columna "Ingreso": Muestra la hora de ingreso
    accessorKey: 'ingreso',
    header: 'Ingreso',
    cell: ({ row }) => {
      const ingreso = row.getValue('ingreso');
      // Si no hay hora de ingreso, muestra guiones
      return ingreso ? ingreso : <span className="text-gray-400">--:--</span>;
    }
  },
];
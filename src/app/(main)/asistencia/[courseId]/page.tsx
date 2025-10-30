// src/app/(main)/asistencia/[courseId]/page.tsx

'use client';

import React, { useState, useEffect} from 'react';
import { useParams } from 'next/navigation'; 
import { ClientResponseError } from 'pocketbase'; 
import { pb } from '@/server/pocketbase'; 
import { columns, AsistenciaEstudiante } from './columns';
import { DataTable } from './data-table';

export default function DetalleAsistenciaPage() {
  const params = useParams();
  const [asistencias, setAsistencias] = useState<AsistenciaEstudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const courseName = decodeURIComponent(params.courseId as string);

  useEffect(() => {
    if (!courseName) return;
    const fetchAsistencia = async () => {
      setLoading(true);
      setError(null);

      try {
        const today = new Date().toISOString().split('T')[0];
        console.log(`Buscando en PocketBase con: course = "${courseName}" Y date = "${today}"`);
        const records = await pb.collection('attendance_management').getFullList<AsistenciaEstudiante>({
          filter: `course ~ "${courseName}" && date ~ "${today}"`, 
          expand: 'student',
          
        });

        setAsistencias(records);
        console.log("Datos recibidos de PocketBase:", records);

      } catch (err) { 
        if (err instanceof ClientResponseError && err.isAbort) {
          console.warn("Petición a PocketBase cancelada (comportamiento normal en desarrollo).");
          // No hacemos nada, porque React lanzará la petición de nuevo.
        } else {
          console.error("Falló la obtención de datos:", err);
          setError("No se pudieron cargar los datos. Revisa la conexión con la base de datos.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAsistencia();
  }, [courseName]);

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Detalles de la Asistencia</h1>
        <p className="text-lg text-gray-600">
          Mostrando la planilla para el curso: <span className="font-semibold text-indigo-600">{courseName}</span>
        </p>
      </header>

      <main>
        {loading && <p className="text-center text-gray-500">Cargando planilla de asistencia...</p>}
        {error && <p className="text-center text-red-500 font-semibold">{error}</p>}
        {/* Solo mostramos la tabla si no está cargando y no hay errores */}
        {!loading && !error && (
          <DataTable columns={columns} data={asistencias} />
        )}
      </main>
    </div>
  );
}
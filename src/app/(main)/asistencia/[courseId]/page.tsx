// src/app/asistencia/[courseId]/page.tsx

'use client';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { pb } from '@/server/pocketbase';
import { columns, AsistenciaEstudiante } from './columns';
import { DataTable } from './data-table';

export default function DetalleAsistenciaPage({ params }: { params: { courseId: string } }) {
    const [asistencias, setAsistencias] = useState<AsistenciaEstudiante[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Decodificamos el nombre del curso para que se muestre bien en la URL (ej: "1°A" en lugar de "1%C2%B0A")  
    const courseName = params.courseId;
    console.log("Cargando datos de asistencia para el curso:", courseName);
    useEffect(() => {
        const fetchAsistencia = async () => {
            try {
                setLoading(true);
                const today = new Date().toISOString().split('T')[0];

                const records = await pb.collection('attendance_management').getFullList<AsistenciaEstudiante>({
                    // Usamos el operador '~' que significa "contiene", porque 'course' es un campo de selección múltiple en tu schema
                    //filter: `course = "${courseName[0]}°${courseName[1]}"`,
                    //filter: 'course = "1°D"',
                    expand: 'student',
                });
                console.log("Datos de asistencia obtenidos:", records);
                setAsistencias(records);
            } catch (err) {
                console.error("Error al obtener los datos de asistencia:", err);
                setError("No se pudieron cargar los datos de asistencia. Revisa la conexión con la base de datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchAsistencia();
    }, [courseName]); // El efecto se vuelve a ejecutar si el nombre del curso cambia

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
                {!loading && !error && (
                    <DataTable columns={columns} data={asistencias} />
                )}
            </main>
        </div>
    );
}
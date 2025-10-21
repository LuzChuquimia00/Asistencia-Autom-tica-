'use client';
import React, { useState, useMemo } from 'react'; // Importamos useMemo para optimizar el filtrado
import Link from 'next/link';
import './asistencia.css';

// --- Datos de los Cursos ---
// (Esta estructura de datos no cambia)
const allCoursesByYear = [
    {
        year: '1°',
        courses: [
            { id: '1A', name: '1A' },
            { id: '1B', name: '1B' },
            { id: '1C', name: '1C' },
            { id: '1D', name: '1D' },
        ],
    },
    {
        year: '2°',
        courses: [
            { id: '2A', name: '2A' },
            { id: '2B', name: '2B' },
            { id: '2C', name: '2C' },
            { id: '2D', name: '2D' },
        ],
    },
    {
        year: '3°',
        courses: [
            { id: '3A', name: '3A' },
            { id: '3B', name: '3B' },
            { id: '3C', name: '3C' },
            { id: '3D', name: '3D' },
        ],
    },
    // Puedes agregar 4to, 5to y 6to año aquí.
];

const AsistenciaPage = () => {
    // 1. Estado para guardar lo que el usuario escribe en la barra de búsqueda.
    const [searchTerm, setSearchTerm] = useState('');

    // 2. Lógica de filtrado en tiempo real.
    // useMemo asegura que el filtrado solo se ejecute cuando searchTerm cambie,
    // lo que hace la aplicación más rápida.
    const filteredCourses = useMemo(() => {
        // Si no hay nada en la búsqueda, muestra todos los cursos.
        if (!searchTerm) {
            return allCoursesByYear;
        }

        // Preparamos el término de búsqueda para que no distinga mayúsculas/minúsculas.
        const lowercasedFilter = searchTerm.toLowerCase();

        // Mapeamos cada grupo de año (1°, 2°, etc.)
        return allCoursesByYear
            .map((yearGroup) => {
                // Filtramos los cursos dentro de cada grupo.
                const filtered = yearGroup.courses.filter((course) =>
                    // Si el nombre del curso (ej. "1A") incluye el texto de búsqueda...
                    course.name.toLowerCase().includes(lowercasedFilter)
                );

                // Devolvemos el grupo de año solo si contiene cursos que coinciden.
                return { ...yearGroup, courses: filtered };
            })
            // Finalmente, eliminamos los grupos de año que quedaron vacíos.
            .filter((yearGroup) => yearGroup.courses.length > 0);
    }, [searchTerm]); // La magia sucede aquí: se vuelve a calcular solo cuando searchTerm cambia.

    return (
        <div className="asistencia-container">
            <header className="asistencia-header">
                <h1>Geasis Asistencia</h1>
                <p>Verifique y gestione la asistencia de los alumnos. El sistema se actualiza automáticamente con los registros de entrada.</p>
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Buscar Curso..."
                        className="search-input"
                        value={searchTerm}
                        // 3. Cada vez que el usuario escribe, actualizamos el estado.
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                    </svg>
                </div>
            </header>

            <main className="planillas-container">
                {/* 4. Si después de filtrar no hay resultados, mostramos un mensaje amigable. */}
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((yearGroup) => (
                        <section key={yearGroup.year} className="planilla-section">
                            <h2 className="planilla-title">Planilla {yearGroup.year}</h2>
                            <div className="course-cards-grid">
                                {yearGroup.courses.map((course) => (
                                    <Link key={course.id} href={`/asistencia/${course.id}`} className="course-card-link">
                                        <div className="course-card">
                                            <div className="card-image-placeholder">
                                                <span>IMG</span>
                                            </div>
                                            <div className="card-course-name">{course.name}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))
                ) : (
                    <p className="no-results-message">No se encontraron planillas para "{searchTerm}".</p>
                )}
            </main>
        </div>
    );
};

export default AsistenciaPage;
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
            { id: '1°A', name: '1°A' },
            { id: '1°B', name: '1°B' },
            { id: '1°C', name: '1°C' },
            { id: '1°D', name: '1°D' },
        ],
    },
    {
        year: '2°',
        courses: [
            { id: '2°A', name: '2°A' },
            { id: '2°B', name: '2°B' },
            { id: '2°C', name: '2°C' },
            { id: '2°D', name: '2°D' },
        ],
    },
    {
        year: '3°',
        courses: [
            { id: '3°A', name: '3°A' },
            { id: '3°B', name: '3°B' },
            { id: '3°C', name: '3°C' },
            { id: '3°D', name: '3°D' },
        ],
    },
    {
        year: '4°',
        courses: [
            { id: '4°A', name: '4°A' },
            { id: '4°B', name: '4°B' },
            { id: '4°C', name: '4°C' },
            { id: '4°D', name: '4°D' },
        ],
    },
    {
        year: '5°',
        courses: [
            { id: '5°A', name: '5°A' },
            { id: '5°B', name: '5°B' },
            { id: '5°C', name: '5°C' },
            { id: '5°D', name: '5°D' },
        ],
    },
    {
        year: '6°',
        courses: [
            { id: '6°A', name: '6°A' },
            { id: '6°B', name: '6°B' },
            { id: '6°C', name: '6°C' },
            { id: '6°D', name: '6°D' },
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
                            <h2 className="planilla-title">{yearGroup.year}</h2>
                            <div className="course-cards-grid">
                                {yearGroup.courses.map((course) => (
                                    <Link key={course.id} href={`/asistencia/${course.id}`} className="course-card-link">
                                        <div className="course-card">
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
'use client';
import React, { useState } from 'react';
import Header from '../components/Header'; // Ojo que la ruta de importación cambia a '../'
import '../globals.css'; // Mantenemos los estilos globales

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <> {/* Usamos un Fragment porque <html> y <body> ya están en el layout principal */}
      <Header toggleSidebar={toggleSidebar} />

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <ul className="nav-list">
              <li className="nav-item active"><a href="/"><span>Inicio</span></a></li>
              <li className="nav-item"><a href="/alumnos"><span>Alumnos</span></a></li>
              <li className="nav-item"><a href="/asistencias"><span>Asistencias</span></a></li>
              <li className="nav-item"><a href="/justificaciones"><span>Justificaciones</span></a></li>
              <li className="nav-item"><a href="/comunicacion"><span>Comunicación</span></a></li>
            </ul>
      </aside>
      
      <div className={`overlay ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
      
      {/* Aquí se renderizarán tus páginas (inicio, alumnos, etc.) */}
      {children}
    </>
  );
}
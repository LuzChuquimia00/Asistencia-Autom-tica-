'use client';

import React from 'react';
import Link from 'next/link';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  currentPath: string; // <-- Añadimos la prop currentPath
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, currentPath }) => {
  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="company-name">Menú</h2>
          <button className="close-btn" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#FFFFFF">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {/* Usamos una expresión para aplicar la clase 'active' si la ruta coincide */}
            <li className={`nav-item ${currentPath === '/inicio' ? 'active' : ''}`}>
              <Link href="/inicio"><span>Inicio</span></Link>
            </li>
            <li className={`nav-item ${currentPath === '/alumnos' ? 'active' : ''}`}>
              <Link href="/alumnos"><span>Alumnos</span></Link>
            </li>
            <li className={`nav-item ${currentPath === '/asistencia' ? 'active' : ''}`}>
              <Link href="/asistencia"><span>Asistencias</span></Link>
            </li>
            <li className={`nav-item ${currentPath === '/justificaciones' ? 'active' : ''}`}>
              <Link href="/justificaciones"><span>Justificaciones</span></Link>
            </li>
            <li className={`nav-item ${currentPath === '/comunicacion' ? 'active' : ''}`}>
              <Link href="/comunicacion"><span>Comunicación</span></Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
    </>
  );
};

export default Sidebar;
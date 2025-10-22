'use client';
import React from 'react';
import Link from 'next/link';
import './Header.css';

interface HeaderProps {
  toggleSidebar: () => void;
  currentPath: string; // <-- Añadimos la prop currentPath
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, currentPath }) => {
  return (
    <header className="main-header">
      <div className="header-left">
        <img src="/assets/UBA-LOGO.png" alt="Logo de Geasis" className="header-logo-img" />
        <span className="logo-text">.UBA Geasis</span>
      </div>
      
      <nav className="desktop-nav">
        <ul className="nav-list">
          {/* Usamos una expresión para aplicar la clase 'active' si la ruta coincide */}
          <li className={`nav-item ${currentPath === '/inicio' ? 'active' : ''}`}>
            <Link href="/inicio">Inicio</Link>
          </li>
          {/* Asumo que 'alumnos' es una página '/alumnos', no un ancla '#alumnos' */}
          <li className={`nav-item ${currentPath === '/alumnos' ? 'active' : ''}`}>
            <Link href="/alumnos">Alumnos</Link>
          </li>
          <li className={`nav-item ${currentPath === '/asistencia' ? 'active' : ''}`}>
            <Link href="/asistencia">Asistencias</Link>
          </li>
          <li className={`nav-item ${currentPath === '/justificaciones' ? 'active' : ''}`}>
            <Link href="/justificaciones">Justificaciones</Link>
          </li>
          <li className={`nav-item ${currentPath === '/comunicacion' ? 'active' : ''}`}>
            <Link href="/comunicacion">Comunicación</Link>
          </li>
        </ul>
      </nav>

      <div className="header-right">
        <button className="mobile-menu-button" onClick={toggleSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
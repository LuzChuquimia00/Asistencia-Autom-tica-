'use client';
import React from 'react';
import Link from 'next/link';
import './Header.css';
import { Preceptor } from '../../types'; // Asegúrate de haber creado este archivo

// Definimos las propiedades que el Header va a recibir
interface HeaderProps {
  toggleSidebar: () => void;
  currentPath: string;
  currentUser: Preceptor; // <--- AQUÍ ACEPTAMOS AL USUARIO
  onLogout: () => void;   // <--- AQUÍ ACEPTAMOS LA FUNCIÓN DE LOGOUT
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, currentPath, currentUser, onLogout }) => {
  return (
    <header className="main-header">
      <div className="header-left">
        <img src="/assets/UBA-LOGO.png" alt="Logo de Geasis" className="header-logo-img" />
        <span className="logo-text">.UBA Geasis</span>
      </div>
      
      <nav className="desktop-nav">
        <ul className="nav-list">
          <li className={`nav-item ${currentPath === '/inicio' ? 'active' : ''}`}>
            <Link href="/inicio">Inicio</Link>
          </li>
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
        {/* Usamos los props recibidos para mostrar la info y el botón */}
        <div className="user-profile-container">
          <span>{currentUser.nombre} ({currentUser.rol})</span>
          <button onClick={onLogout} className="logout-button" title="Cerrar Sesión">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm600-280-176-176 56-56 240 240-240 240-56-56 176-176H440v-80h360Z"/>
            </svg>
          </button>
        </div>
        
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
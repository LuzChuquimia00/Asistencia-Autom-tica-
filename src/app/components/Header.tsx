'use client';
import React from 'react';
import Link from 'next/link'; // Importamos Link para la navegación
import './Header.css';
// Definimos los tipos de las props que el componente recibirá
interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="main-header">
      <div className="header-left">
        <img src="/assets/UBA-LOGO.png" alt="Logo de Geasis" className="header-logo-img" />
        <span className="logo-text">.UBA Geasis</span>
      </div>
      
      {/* --- Navegación para Escritorio (se oculta en móvil) --- */}
      <nav className="desktop-nav">
        <ul className="nav-list">
          {/* NOTA: Cambié las etiquetas <a> por <Link> de Next.js para una mejor navegación */}
          <li className="nav-item active"><Link href="/">Inicio</Link></li>
          <li className="nav-item"><Link href="/alumnos">Alumnos</Link></li>
          <li className="nav-item"><Link href="/asistencia">Asistencias</Link></li>
          <li className="nav-item"><Link href="/justificaciones">Justificaciones</Link></li>
          <li className="nav-item"><Link href="/comunicacion">Comunicación</Link></li>
        </ul>
      </nav>

      <div className="header-right">
        {/* --- Botón "Hamburguesa" para abrir el sidebar en móvil --- */}
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
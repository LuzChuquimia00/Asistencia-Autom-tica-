'use client';
import React, { useState, useEffect } from 'react';
import './Inicio.css';
import { pb } from '../../server/pocketbase';

const Inicio = ({ isSidebarOpen, toggleSidebar }: { isSidebarOpen: boolean, toggleSidebar: () => void }) => {
  const [presentes, setPresentes] = useState(0);
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [ausentes, setAusentes] = useState(0);
  const [justificaciones, setJustificaciones] = useState(0);
  const [sinJustificaciones, setSinJustificaciones] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchDashboardData = async () => {
      if (ignore) return;
      try {

        const summaryData = await pb.collection('dashboard_summary').getFirstListItem('');

        if (!ignore) {
          setTotalAlumnos(summaryData.total_students);
          setPresentes(summaryData.present_count);
          setAusentes(summaryData.absent_count);
          setJustificaciones(summaryData.justified_count);
          setSinJustificaciones(summaryData.unjustified_count);
        }

      } catch (err) {
          setError('Error al conectar con la base de datos.');
          console.error("Error fetching data from PocketBase:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    pb.collection('students').subscribe('*', fetchDashboardData);
    pb.collection('attendance_management').subscribe('*', fetchDashboardData);
    pb.collection('management_of_justifications').subscribe('*', fetchDashboardData);

    return () => {
      ignore = true;
      pb.collection('students').unsubscribe();
      pb.collection('attendance_management').unsubscribe();
      pb.collection('management_of_justifications').unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="loading-container">Calculando resumen del día...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  const today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="layout-container">
      {/* ================================================================== */}
      {/* 1. HEADER PRINCIPAL (Visible en todas las pantallas)             */}
      {/* ================================================================== */}
      <header className="main-header">
        <div className="header-left">
          <span className="logo-text">Geasis UBA</span>
        </div>
        
        {/* --- Navegación para Escritorio (se oculta en móvil) --- */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            <li className="nav-item active"><a href="#inicio">Inicio</a></li>
            <li className="nav-item"><a href="#alumnos">Alumnos</a></li>
            <li className="nav-item"><a href="#asistencias">Asistencias</a></li>
            <li className="nav-item"><a href="#justificaciones">Justificaciones</a></li>
            <li className="nav-item"><a href="#comunicacion">Comunicación</a></li>
          </ul>
        </nav>

        <div className="header-right">
          <div className="user-profile">
            <span>ono</span>
          </div>
          {/* --- Botón "Hamburguesa" para abrir el sidebar en móvil --- */}
          <button className="mobile-menu-button" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
            </svg>
          </button>
        </div>
      </header>
      
      {/* ================================================================== */}
      {/* 2. SIDEBAR (Ahora funciona solo como menú móvil)                 */}
      {/* ================================================================== */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="company-name">Menú</h2>
          <button className="close-btn" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#FFFFFF">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <nav className="sidebar-nav">
          {/* La lista de navegación del sidebar se mantiene igual */}
          <ul className="nav-list">
             <li className="nav-item active"><a href="#inicio"><span>Inicio</span></a></li>
             <li className="nav-item"><a href="#alumnos"><span>Alumnos</span></a></li>
             <li className="nav-item"><a href="#asistencias"><span>Asistencias</span></a></li>
             <li className="nav-item"><a href="#justificaciones"><span>Justificaciones</span></a></li>
             <li className="nav-item"><a href="#comunicacion"><span>Comunicación</span></a></li>
          </ul>
        </nav>
      </aside>

      {/* Overlay para el fondo en móvil */}
      <div className={`overlay ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>

      {/* ================================================================== */}
      {/* 3. CONTENIDO PRINCIPAL                                           */}
      {/* ================================================================== */}
      <main className="main-content">
        <div className="page-title">
          <h1>Geasis Inicio</h1>
          <p className="current-date">{today}</p>
        </div>
        <p className="subtitle">Resumen general del estado de las asistencias.</p>
        
        {/* La grilla de tarjetas se mantiene igual */}
        <div className="summary-cards-grid">
          {/* Card Asistencias */}
          <div className="card assistencias-card">
            {/* ... contenido ... */}
            <p className="card-label">Asistencias</p>
            <p className="card-value" id='porcentaje_asistencia'>{presentes} / {totalAlumnos}</p>
          </div>
          {/* Card Ausentes */}
          <div className="card ausentes-card">
            {/* ... contenido ... */}
            <p className="card-label">Ausentes</p>
            <p className="card-value" id='ausentes'>{ausentes}</p>
          </div>
          {/* Card Justificaciones */}
          <div className="card justificaciones-card">
            {/* ... contenido ... */}
            <p className="card-label">Justificaciones</p>
            <p className="card-value" id='justificaciones'>{justificaciones}</p>
          </div>
          {/* Card Sin Justificar */}
          <div className="card sin-justificar-card">
            {/* ... contenido ... */}
            <p className="card-label">Sin justificar</p>
            <p className="card-value" id='Sin_justificaciones'>{sinJustificaciones}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inicio;
'use client';

import { useState } from 'react';
import {usePathname} from 'next/navigation';
import Header from '../components/Header'; // La ruta sube un nivel a /components
import Sidebar from '../components/Sidebar'; // Importamos el nuevo Sidebar

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // El estado del sidebar vive aquí, en el layout que no se destruye
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const pathname = usePathname();

  return (
    <>
      {/* El Header y Sidebar se renderizan para todas las páginas de este grupo */}
      <Header toggleSidebar={toggleSidebar} currentPath={''} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} currentPath={''} />
      
      {/* El contenido específico de cada página se insertará aquí */}
      <main className="main-content">
        {children}
      </main>
    </>
  );
}
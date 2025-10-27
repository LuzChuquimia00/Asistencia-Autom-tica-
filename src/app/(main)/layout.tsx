'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { pb } from '@/server/pocketbase'; // Asegúrate que la ruta sea correcta
import { Preceptor } from '@/types'; // Importa el tipo que definimos

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Usamos el tipo Preceptor para el estado, permitiendo que sea null si no hay sesión
  const [currentUser, setCurrentUser] = useState<Preceptor | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Verificar la sesión al cargar
    if (!pb.authStore.isValid) {
      router.push('/login');
      return;
    }
    // Asignamos el modelo al estado, casteando al tipo Preceptor
    setCurrentUser(pb.authStore.model as Preceptor);

    // 2. Escuchar cambios en la sesión
    const unsubscribe = pb.authStore.onChange(() => {
      setCurrentUser(pb.authStore.model as Preceptor | null);
      if (!pb.authStore.isValid) {
        router.push('/login');
      }
    });

    // 3. Limpiar la suscripción
    return () => {
      unsubscribe();
    };
  }, [router]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    pb.authStore.clear(); // Esto activará el 'onChange' y la redirección
  };

  // No renderizar el layout principal hasta que se confirme que el usuario está logueado
  if (!currentUser) {
    return null; // O un spinner de carga para una mejor experiencia de usuario
  }

  return (
    <>
      <Header
        toggleSidebar={toggleSidebar}
        currentPath={pathname} // Pasamos el pathname real
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        currentPath={pathname} // Pasamos el pathname real
      />
      
      <main className="main-content">
        {children}
      </main>
    </>
  );
}
'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Importa Link para el enlace de recuperación
import { pb } from '@/server/pocketbase';
import './login.css'; // Crearemos este archivo de estilos

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Redirige si el usuario ya tiene una sesión válida
    useEffect(() => {
        if (pb.authStore.isValid) {
            router.push('/inicio');
        }
    }, [router]);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Criterio: Autenticación con email y contraseña
            const authData = await pb.collection('preceptores').authWithPassword(email, password);

            // Criterio: Verificar si el preceptor está 'activo'
            if (!authData.record.activo) {
                pb.authStore.clear(); // Si no está activo, cerramos la sesión inmediatamente
                setError('Tu cuenta no está activa. Contacta al administrador.');
                setIsLoading(false);
                return;
            }

            // Criterio: Redirección exitosa tras iniciar sesión
            router.push('/inicio');

        } catch (err) {
            // Criterio: Mensaje de error claro
            setError('Usuario o contraseña inválidos.');
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Iniciar Sesión</h1>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label htmlFor="email">Usuario (Email)</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Ingrese su email"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Ingrese su contraseña"
                            disabled={isLoading}
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    
                    <button type="submit" disabled={isLoading} className="login-button">
                        {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                    
                    <Link href="/forgot-password" className="forgot-password-link">
                      He olvidado mi contraseña
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
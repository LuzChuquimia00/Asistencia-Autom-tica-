'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { pb } from '../../server/pocketbase';
import './forgot-password.css'; // Usaremos el CSS que ya me habías pasado

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRequestReset = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            // Esta función de PocketBase envía el email de recuperación
            await pb.collection('preceptores').requestPasswordReset(email);
            setMessage('Si existe una cuenta con ese correo, se ha enviado un enlace para restablecer la contraseña.');
        } catch (err) {
            // Por seguridad, no revelamos si el email existe o no.
            // Mostramos un mensaje genérico.
            setMessage('Si existe una cuenta con ese correo, se ha enviado un enlace para restablecer la contraseña.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <h1 className="forgot-password-title">Recuperar Cuenta</h1>

                {/* Mostramos el mensaje de éxito aquí */}
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                
                <form onSubmit={handleRequestReset} className="forgot-password-form">
                    <p className="form-description">
                        Introduce tu correo electrónico para recibir un enlace y restablecer tu contraseña.
                    </p>
                    <div className="input-group">
                        <label htmlFor="email">Correo electrónico:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="ejemplo@etec.uba.ar"
                            disabled={isLoading}
                        />
                    </div>
                    {/* Aquí podrías añadir el captcha como en tu imagen, pero eso requiere librerías externas.
                        Por ahora, lo dejamos simple. */}
                    
                    <button type="submit" disabled={isLoading} className="forgot-password-button">
                        {isLoading ? 'Enviando...' : 'Enviar enlace'}
                    </button>
                    <Link href="/login" className="cancel-link">
                        Cancelar
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
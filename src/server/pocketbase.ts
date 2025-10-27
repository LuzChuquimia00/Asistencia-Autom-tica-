import PocketBase, { ClientResponseError } from "pocketbase";

// 1. CORRECCIÓN: Quitamos el "/_" del final de la URL.
export const pb = new PocketBase("http://127.0.0.1:8090");

// 2. MEJORA: Añadimos el manejo de sesión con localStorage del otro proyecto.
// Esto asegura que la sesión se guarde y recupere correctamente en el navegador.
if (typeof window !== 'undefined') {
    pb.authStore.loadFromCookie(localStorage.getItem('pb_auth') || '');

    pb.authStore.onChange(() => {
        localStorage.setItem('pb_auth', pb.authStore.exportToCookie());
    });
}

// El resto de tu código se mantiene igual.
const ADMIN_EMAIL = "luz@gmail.com";
const ADMIN_PASSWORD = "ChuquimiaLuz";

export async function authenticateAsAdmin(): Promise<boolean> {
    if (pb.authStore.isValid) {
        return true;
    }
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log("PocketBase: Autenticación de Administrador exitosa.");
        return true;
    } catch (error) {
        console.error("PocketBase: Error de autenticación de Administrador.", error);
        throw new Error("No se pudo conectar y autenticar con PocketBase.");
    }
}

export async function createPreceptor(preceptorData: {
    password: string;
    email: string;
    nombre: string;
    apellido: string;
    grado: string;
    rol: string;
    activo: boolean;
}): Promise<{ success: boolean; errorMessage?: string }> {
    const collectionName = "preceptores";
    const payload = {
        ...preceptorData,
        passwordConfirm: preceptorData.password,
    };
    try {
        await pb.collection(collectionName).create(payload);
        return { success: true };
    } catch (error) {
        if (error instanceof ClientResponseError) {
            return { success: false, errorMessage: JSON.stringify(error.response) };
        }
        return { success: false, errorMessage: String(error) };
    }
}
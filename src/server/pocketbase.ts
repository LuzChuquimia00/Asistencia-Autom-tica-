import PocketBase from 'pocketbase';
// Credenciales del Administrador de PocketBase.
const ADMIN_EMAIL = 'huaynocajazmin999@gmail.com'; 
const ADMIN_PASSWORD = 'BuenosAires'; 

// Configuración de PocketBase.
export const pb = new PocketBase('http://127.0.0.1:8090/');

//autenticar como admin
export async function authenticateAsAdmin(): Promise<boolean> {
    // Si ya está autenticado o la sesión es válida (y no ha expirado), no re-autenticar
    if (pb.authStore.isValid) {
        return true;
    }
    
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('PocketBase: Autenticación de Administrador exitosa.');
        return true;
    } catch (error) {
        console.error('PocketBase: Error de autenticación de Administrador. Revisa URL, Email y Contraseña.', error);
        throw new Error('No se pudo conectar y autenticar con PocketBase. Verifica URL y credenciales de Admin.');
    }
}

/**
 * Registra un único preceptor en la colección 'preceptores'.
 * @param preceptorData Los datos completos del preceptor, incluyendo credenciales.
 */
export async function createPreceptor(preceptorData: any): Promise<{ success: boolean, errorMessage?: string }> {
    const collectionName = 'preceptores';
    
    // PocketBase requiere 'passwordConfirm' para colecciones de tipo Auth
    const payload = {
        ...preceptorData,
        passwordConfirm: preceptorData.password 
    };

    try {
        await pb.collection(collectionName).create(payload);
        return { success: true };
    } catch (error: any) {
        const errorDetails = error.data?.data;
        let errorMessage = 'Error desconocido al crear registro.';
        
        if (errorDetails) {
            // manejo de errores comunes de validación de PocketBase
            if (errorDetails.username) {
                errorMessage = `El nombre de usuario '${preceptorData.username}' ya existe o no es válido.`;
            } else if (errorDetails.password) {
                errorMessage = 'La contraseña no cumple con los requisitos de PocketBase.';
            } else if (errorDetails.nombre || errorDetails.apellido || errorDetails.grado) {
                errorMessage = 'Fallo de validación en campos obligatorios.';
            } else {
                 errorMessage = JSON.stringify(errorDetails, null, 2);
            }
        }
        
        console.error(`Error al registrar preceptor: ${preceptorData.username}`, error);
        return { success: false, errorMessage };
    }
}

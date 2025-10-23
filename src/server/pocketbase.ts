import PocketBase,{ClientResponseError} from "pocketbase";
export const pb = new PocketBase("http://127.0.0.1:8090/");
pb.autoCancellation(false);

//autenticar como admin
const ADMIN_EMAIL = "huaynocajazmin999@gmail.com";
const ADMIN_PASSWORD = "BuenosAires";

//autenticar como admin
export async function authenticateAsAdmin(): Promise<boolean> {
  // Si ya está autenticado o la sesión es válida (y no ha expirado), no re-autenticar
  if (pb.authStore.isValid) {
    return true;
  }

  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log("PocketBase: Autenticación de Administrador exitosa.");
    return true;
  } catch (error) {
    console.error(
      "PocketBase: Error de autenticación de Administrador. Revisa URL, Email y Contraseña.",
      error
    );
    throw new Error(
      "No se pudo conectar y autenticar con PocketBase. Verifica URL y credenciales de Admin."
    );
  }
}

/**
 * Registra un único preceptor en la colección 'preceptores'.
 * @param preceptorData Los datos completos del preceptor, incluyendo credenciales.
 */
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

  // PocketBase requiere 'passwordConfirm' para colecciones de tipo Auth
  const payload = {
    ...preceptorData,
    passwordConfirm: preceptorData.password,
  };

  try {
    await pb.collection(collectionName).create(payload);
    console.log(`Preceptor registrado: ${preceptorData.email}`);
    return { success: true };
  } catch (error) {
    console.error(
      `Error al registrar preceptor: ${preceptorData.email}`,
      error
    );
    
    let errorDetails: string;
    
    if (error instanceof ClientResponseError) {
        errorDetails = JSON.stringify(error.response); 
    } else {
        errorDetails = String(error); 
    }
    return { success: false, errorMessage: JSON.stringify(error) };
  }
}
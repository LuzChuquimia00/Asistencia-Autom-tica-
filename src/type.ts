// Para los datos que vienen de PocketBase
import { RecordModel } from "pocketbase";

// Extendemos el modelo base de PocketBase con los campos de tu colección 'preceptores'
export interface Preceptor extends RecordModel {
  nombre: string;
  apellido: string;
  rol: 'preceptor' | 'admin'; // Puedes ajustar los roles si tienes más
  activo: boolean;
  // Añade aquí cualquier otro campo que necesites del preceptor
}
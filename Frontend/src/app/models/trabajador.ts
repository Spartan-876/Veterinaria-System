import { Usuario } from "./usuario";

export interface Trabajador {
    id?: number;
    dni: string;
    nombres: string;
    apellidos: string;
    cargo: 'VETERINARIO' | 'ESTILISTA' | 'CIRUJANO' | 'RECEPCIONISTA';
    telefono: string;
    correo: string;
    estado: 'ACTIVO' | 'INACTIVO';
}

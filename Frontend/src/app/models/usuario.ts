import { Rol } from "./rol";

export interface Usuario {
    id?: number;
    username: string;
    password?: string; // Opcional para cuando solo listamos
    roles?: Rol[];
    estado: 'ACTIVO' | 'INACTIVO';
}
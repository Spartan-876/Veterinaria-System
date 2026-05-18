import {TrabajadorServicioDTO} from './TrabajadorServicioDTO';

export interface Servicio {
  id?: number;
  nombre: string;
  descripcion: string;
  icono?: string;
  precio: number;
  estado: 'ACTIVO' | 'INACTIVO';
  trabajadores?: TrabajadorServicioDTO[];
}

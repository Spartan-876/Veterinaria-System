export interface Cliente {
  id?: number;
  dni: string;
  nombres: string;
  apellidos: string;
  direccion: string;
  telefono: string;
  correo: string;
  totalMascotas?: number;
}

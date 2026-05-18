export interface Cita {
  id?: number;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'REALIZADA' | 'CANCELADA';
  fechaHora: string;
  motivo: string;
  precioServicio?: number;
  servicioId: number;
  servicioNombre: string;
  mascotaId: number;
  mascotaNombre: string;
  clienteId: number;
  clienteNombre: string;
  trabajadorId: number;
  trabajadorNombre: string;
}

export interface CitaRequestDTO {
  mascotaId: number;
  servicioId: number;
  trabajadorId: number;
  fechaHora: string;
  motivo: string;
}

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
}

export interface TrabajadorDisponible {
  id: number;
  nombres: string;
  apellidos: string;
  cargo: string;
}

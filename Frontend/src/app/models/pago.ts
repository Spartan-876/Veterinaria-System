export interface Pago {
  id: number;
  ventaId?: number;
  citaId?: number;
  monto: number;
  metodoPago: string;
  comentario?: string;
  fechaPago: string;
}

export interface PagoRequestDTO {
  ventaId?: number;
  citaId?: number;
  monto: number;
  metodoPago: string;
  comentario?: string;
}

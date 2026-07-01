export interface HistorialVacunacion {
  id?: number;
  mascota?: { id: number };
  trabajadorId?: number;
  nombreVacuna: string;
  fechaAplicacion?: string;
  lote?: string;
  reacciones?: string;
  observaciones?: string;
}

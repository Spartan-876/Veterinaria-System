export type EventType = 'cita' | 'consulta' | 'vacuna';

export interface TimelineEvent {
  tipo: EventType;
  fecha: string;
  titulo: string;
  descripcion: string;
  icono: string;
  colorClass: string;
  bgClass: string;
  detalles?: {
    diagnostico?: string;
    tratamiento?: string;
    peso?: number;
    servicio?: string;
    profesional?: string;
    motivo?: string;
    lote?: string;
    reacciones?: string;
    enfermedad?: string;
  };
}

export interface Horario {
  id?: number;
  trabajadorId: number;
  diaSemana: DiaSemana;
  horaInicio: string; // "HH:mm"
  horaFin: string;    // "HH:mm"
  activo?: boolean;
}

export type DiaSemana =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export const DIAS_SEMANA: { valor: DiaSemana; label: string; corto: string }[] = [
  { valor: 'MONDAY',    label: 'Lunes',     corto: 'Lun' },
  { valor: 'TUESDAY',   label: 'Martes',    corto: 'Mar' },
  { valor: 'WEDNESDAY', label: 'Miércoles', corto: 'Mié' },
  { valor: 'THURSDAY',  label: 'Jueves',    corto: 'Jue' },
  { valor: 'FRIDAY',    label: 'Viernes',   corto: 'Vie' },
  { valor: 'SATURDAY',  label: 'Sábado',    corto: 'Sáb' },
  { valor: 'SUNDAY',    label: 'Domingo',   corto: 'Dom' },
];

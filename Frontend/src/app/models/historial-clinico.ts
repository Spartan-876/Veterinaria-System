export interface HistorialClinico {
  id?: number;
  mascota?: { id: number };
  citaId?: number;
  fechaRegistro?: string;
  enfermedadDetectada?: string;
  vacunaAplicada?: string;
  diagnostico?: string;
  tratamiento?: string;
  peso?: number;
}

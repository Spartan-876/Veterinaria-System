import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HorarioAgenda {
  id: number;
  trabajadorId: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
}

export interface CitaAgenda {
  id: number;
  fechaHora: string;
  motivo: string;
  estado: string;
  mascotaId?: number;
  mascotaNombre: string;
  servicioId?: number;
  servicioNombre: string;
  trabajadorId?: number;
  trabajadorNombre: string;
  clienteNombre?: string;
}

export interface AgendaData {
  citasHoy: CitaAgenda[];
  citasSemana: CitaAgenda[];
  horarioHoy: HorarioAgenda[];
}

@Injectable({ providedIn: 'root' })
export class AgendaService {
  private url = `${environment.apiUrl}/api/agenda`;

  constructor(private http: HttpClient) {}

  getMiAgenda(): Observable<AgendaData> {
    return this.http.get<AgendaData>(`${this.url}/mi-agenda`);
  }
}
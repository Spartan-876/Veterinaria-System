import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HistorialClinico } from '../models/historial-clinico';
import { HistorialVacunacion } from '../models/historial-vacunacion';
import { Cita } from '../models/cita';
import { TimelineEvent } from '../models/historial-mascota';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HistorialMascotaService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerHistorial(mascotaId: number): Observable<TimelineEvent[]> {
    const clinicos$ = this.http.get<HistorialClinico[]>(
      `${this.url}/api/historial-clinico/mascota/${mascotaId}`
    ).pipe(catchError(() => of([])));

    const vacunas$ = this.http.get<HistorialVacunacion[]>(
      `${this.url}/api/vacunas/mascota/${mascotaId}`
    ).pipe(catchError(() => of([])));

    const citas$ = this.http.get<Cita[]>(
      `${this.url}/api/citas/mascota/${mascotaId}`
    ).pipe(catchError(() => of([])));

    return forkJoin([clinicos$, vacunas$, citas$]).pipe(
      map(([clinicos, vacunas, citas]) => {
        const eventos: TimelineEvent[] = [];

        clinicos.forEach(c => {
          if (c.enfermedadDetectada || c.diagnostico) {
            eventos.push({
              tipo: 'consulta',
              fecha: c.fechaRegistro ?? '',
              titulo: c.diagnostico ?? 'Consulta médica',
              descripcion: c.enfermedadDetectada
                ? `Enfermedad detectada: ${c.enfermedadDetectada}`
                : 'Registro de consulta',
              icono: 'stethoscope',
              colorClass: 'text-emerald-600',
              bgClass: 'bg-emerald-50',
              detalles: {
                diagnostico: c.diagnostico ?? undefined,
                tratamiento: c.tratamiento ?? undefined,
                peso: c.peso ?? undefined,
                enfermedad: c.enfermedadDetectada ?? undefined,
              }
            });
          }
          if (c.vacunaAplicada) {
            eventos.push({
              tipo: 'vacuna',
              fecha: c.fechaRegistro ?? '',
              titulo: c.vacunaAplicada,
              descripcion: 'Vacuna aplicada en consulta',
              icono: 'vaccines',
              colorClass: 'text-purple-600',
              bgClass: 'bg-purple-50',
              detalles: {
                peso: c.peso ?? undefined,
              }
            });
          }
        });

        vacunas.forEach(v => {
          eventos.push({
            tipo: 'vacuna',
            fecha: v.fechaAplicacion ?? '',
            titulo: v.nombreVacuna,
            descripcion: v.lote ? `Lote: ${v.lote}` : 'Vacunación registrada',
            icono: 'vaccines',
            colorClass: 'text-purple-600',
            bgClass: 'bg-purple-50',
            detalles: {
              lote: v.lote ?? undefined,
              reacciones: v.reacciones ?? undefined,
              profesional: v.trabajadorId ? `Trabajador #${v.trabajadorId}` : undefined,
            }
          });
        });

        citas
          .filter(c => c.estado === 'REALIZADA' || c.estado === 'CONFIRMADA')
          .forEach(c => {
            eventos.push({
              tipo: 'cita',
              fecha: c.fechaHora ?? '',
              titulo: c.servicioNombre ?? 'Cita',
              descripcion: c.motivo ?? 'Sin motivo especificado',
              icono: 'calendar_month',
              colorClass: 'text-blue-600',
              bgClass: 'bg-blue-50',
              detalles: {
                servicio: c.servicioNombre ?? undefined,
                profesional: c.trabajadorNombre ?? undefined,
                motivo: c.motivo ?? undefined,
              }
            });
          });

        eventos.sort((a, b) => {
          const fa = a.fecha ? new Date(a.fecha).getTime() : 0;
          const fb = b.fecha ? new Date(b.fecha).getTime() : 0;
          return fb - fa;
        });

        return eventos;
      })
    );
  }
}

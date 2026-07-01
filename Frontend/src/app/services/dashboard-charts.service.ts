import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IngresoMes, EstadoCount, EspecieCount, ServicioCount } from '../models/dashboard-charts';
import { PagosResumenDTO } from '../models/pagos';
import { Cita } from '../models/cita';
import { Mascota } from '../models/mascota';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardChartsService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerIngresosMensuales(): Observable<IngresoMes[]> {
    return this.http.get<PagosResumenDTO>(`${this.url}/api/pagos/resumen`).pipe(
      map(res => (res.porMes ?? []).map(m => ({
        mes: m.mes,
        citas: m.citas,
        productos: m.productos
      }))),
      catchError(() => of([]))
    );
  }

  obtenerCitasPorEstado(): Observable<EstadoCount[]> {
    return this.http.get<Cita[]>(`${this.url}/api/citas`).pipe(
      map(citas => {
        const mapa = new Map<string, number>();
        citas.forEach(c => {
          mapa.set(c.estado, (mapa.get(c.estado) ?? 0) + 1);
        });
        return Array.from(mapa.entries())
          .map(([estado, count]) => ({ estado, count }))
          .sort((a, b) => b.count - a.count);
      }),
      catchError(() => of([]))
    );
  }

  obtenerMascotasPorEspecie(): Observable<EspecieCount[]> {
    return this.http.get<Mascota[]>(`${this.url}/api/mascotas`).pipe(
      map(mascotas => {
        const mapa = new Map<string, number>();
        mascotas.forEach(m => {
          const esp = m.especie ?? 'Otra';
          mapa.set(esp, (mapa.get(esp) ?? 0) + 1);
        });
        return Array.from(mapa.entries())
          .map(([especie, count]) => ({ especie, count }))
          .sort((a, b) => b.count - a.count);
      }),
      catchError(() => of([]))
    );
  }

  obtenerTopServicios(): Observable<ServicioCount[]> {
    return this.http.get<Cita[]>(`${this.url}/api/citas`).pipe(
      map(citas => {
        const mapa = new Map<string, number>();
        citas.forEach(c => {
          if (c.servicioNombre) {
            mapa.set(c.servicioNombre, (mapa.get(c.servicioNombre) ?? 0) + 1);
          }
        });
        return Array.from(mapa.entries())
          .map(([servicio, count]) => ({ servicio, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      }),
      catchError(() => of([]))
    );
  }
}

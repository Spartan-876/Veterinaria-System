import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita, CitaRequestDTO, Mascota, TrabajadorDisponible } from '../models/cita';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private url = `${environment.apiUrl}/api/citas`;

  constructor(private http: HttpClient) {}

  listarCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.url);
  }

  listarPorCliente(clienteId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.url}/cliente/${clienteId}`);
  }

  crearCita(dto: CitaRequestDTO): Observable<Cita> {
    return this.http.post<Cita>(this.url, dto);
  }

  cancelarCita(id: number): Observable<Cita> {
    return this.http.patch<Cita>(`${this.url}/${id}/cancelar`, {});
  }

  cambiarEstado(id: number, estado: string): Observable<Cita> {
    return this.http.patch<Cita>(`${this.url}/${id}/estado?estado=${estado}`, {});
  }

  trabajadoresDisponibles(servicioId: number, fechaHora: string): Observable<TrabajadorDisponible[]> {
    const params = new HttpParams()
      .set('servicioId', servicioId)
      .set('fechaHora', fechaHora);
    return this.http.get<TrabajadorDisponible[]>(`${this.url}/trabajadores-disponibles`, { params });
  }

  mascotasPorCliente(clienteId: number): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.url}/mascotas/cliente/${clienteId}`);
  }
}

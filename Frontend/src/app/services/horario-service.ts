import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Horario} from '../models/horario';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  private url = `${environment.apiUrl}/api/horarios`;

  constructor(private http: HttpClient) {}

  porTrabajador(id: number): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.url}/trabajador/${id}`);
  }

  crear(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(this.url, horario);
  }

  actualizar(id: number, horario: Horario): Observable<Horario> {
    return this.http.put<Horario>(`${this.url}/${id}`, horario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

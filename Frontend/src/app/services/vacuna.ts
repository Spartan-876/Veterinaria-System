import { Injectable } from '@angular/core';
import { Vacuna } from '../models/vacuna';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VacunaService {
  private apiUrl = `${environment.apiUrl}/api/vacunas`;

  constructor(private http: HttpClient) { }

  listarVacunas(): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(this.apiUrl + '/catalogo');
  }

  obtenerVacunaPorId(id: number): Observable<Vacuna> {
    return this.http.get<Vacuna>(`${this.apiUrl}/${id}`);
  }

  crearVacuna(vacuna: Vacuna): Observable<Vacuna> {
    return this.http.post<Vacuna>(`${this.apiUrl}/guardar`, vacuna);
  }

  actualizarVacuna(vacuna: Vacuna): Observable<Vacuna> {
    return this.http.put<Vacuna>(`${this.apiUrl}/${vacuna.id}`, vacuna);
  }

  eliminarVacuna(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

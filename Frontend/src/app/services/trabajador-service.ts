import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trabajador } from '../models/trabajador';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrabajadorService {
  private apiUrl = `${environment.apiUrl}/api/trabajadores`;

  constructor(private http: HttpClient) {
  }

  // GET: listarActivos()
  listarTrabajadores(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(this.apiUrl);
  }

  eliminarTrabajador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}

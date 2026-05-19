import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modulo } from '../models/modulo';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ModuloService {
  private apiUrl = `${environment.apiUrl}/api/modulos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Modulo> {
    return this.http.get<Modulo>(`${this.apiUrl}/${id}`);
  }
}
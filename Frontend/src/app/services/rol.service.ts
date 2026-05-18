import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Rol } from '../models/rol';

@Injectable({ providedIn: 'root' })
export class RolService {
  private apiUrl = `${environment.apiUrl}/api/roles`;

  constructor(private http: HttpClient) {}

  listar(): any {
    return this.http.get<Rol[]>(this.apiUrl);
  }

  obtenerPorId(id: number): any {
    return this.http.get<Rol>(`${this.apiUrl}/${id}`);
  }

  crear(rol: Rol): any {
    return this.http.post<Rol>(this.apiUrl, rol);
  }

  actualizar(id: number, rol: Rol): any {
    return this.http.put<Rol>(`${this.apiUrl}/${id}`, rol);
  }

  eliminar(id: number): any {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
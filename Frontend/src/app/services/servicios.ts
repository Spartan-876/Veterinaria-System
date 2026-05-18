import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Servicio } from '../models/servicios';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  private apiUrl = `${environment.apiUrl}/api/servicios`;

  constructor(private http: HttpClient) { }

  listarActivos() {
    return this.http.get<Servicio[]>(`${this.apiUrl}/activos`);
  }

  listar() {
    return this.http.get<Servicio[]>(`${this.apiUrl}`);
  }

}

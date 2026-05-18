import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta, VentaRequestDTO } from '../models/carrito';
import {environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private url = `${environment.apiUrl}/api/ventas`;

  constructor(private http: HttpClient) {}

  realizarVenta(dto: VentaRequestDTO): Observable<Venta> {
    return this.http.post<Venta>(this.url, dto);
  }

  listarTodas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.url);
  }

  listarPorCliente(clienteId: number): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.url}/cliente/${clienteId}`);
  }
}

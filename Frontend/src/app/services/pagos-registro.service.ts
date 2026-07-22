import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago, PagoRequestDTO } from '../models/pago';
import {environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PagosRegistroService {
  private url = `${environment.apiUrl}/api/pagos`;

  constructor(private http: HttpClient) {}

  registrarPago(dto: PagoRequestDTO): Observable<Pago> {
    return this.http.post<Pago>(this.url, dto);
  }

  listarPorVenta(ventaId: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.url}/venta/${ventaId}`);
  }

  listarPorCita(citaId: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.url}/cita/${citaId}`);
  }
}

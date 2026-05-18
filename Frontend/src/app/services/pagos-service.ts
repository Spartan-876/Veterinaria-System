import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagosResumenDTO } from '../models/pagos';
import {environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PagosService {
  private url = `${environment.apiUrl}/api/pagos`;

  constructor(private http: HttpClient) {}

  getResumen(): Observable<PagosResumenDTO> {
    return this.http.get<PagosResumenDTO>(`${this.url}/resumen`);
  }
}

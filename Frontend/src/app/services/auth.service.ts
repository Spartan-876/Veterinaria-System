import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(correo: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { correo, password });
  }

  guardarSesion(res: any): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('correo', res.correo);
    localStorage.setItem('rol', res.rol);
    localStorage.setItem('nombre', res.nombre);

    if (res.trabajadorId) {
      localStorage.setItem('trabajadorId', res.trabajadorId);
    }

    if (res.clienteId) {
      localStorage.setItem('clienteId', res.clienteId.toString());
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/inicio']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }
}

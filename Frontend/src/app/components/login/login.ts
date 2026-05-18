import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef} from '@angular/core';
import { GToast} from '../../services/gtoast';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class Login {

  tabActivo: 'login' | 'register' = 'login';
  mostrarPassword = false;
  mostrarPasswordReg = false;

  // Alertas
  errorMsg: string = '';
  successMsg: string = '';

  // Login
  loginData = {
    correo: '',
    password: '',
    rememberMe: false
  };

  // Registro
  registerData = {
    nombres: '',
    apellidos: '',
    dni: '',
    telefono: '',
    direccion: '',
    correo: '',
    password: ''
  };

  constructor(private authService: AuthService,private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef , private toast : GToast) {}

  cambiarTab(tab: 'login' | 'register'): void {
    this.tabActivo = tab;
    this.errorMsg = '';
    this.successMsg = '';
  }

  iniciarSesion(): void {
    this.errorMsg = '';
    this.authService.login(this.loginData.correo, this.loginData.password)
      .subscribe({
        next: (res) => {
          this.authService.guardarSesion(res);
          this.redirigirSegunRol(res.rol)
        },
        error: () => {
          this.errorMsg = 'Usuario o contraseña incorrectos.';
        }
      });
  }

  redirigirSegunRol(rol: string): void {
    if (rol === 'ROLE_ADMIN' || rol === 'ROLE_VET') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/inicio']); // clientes van a la landing
    }
  }

  registrarse(): void {
    this.errorMsg = '';
    this.http.post(`${environment.apiUrl}/api/auth/registro/cliente`, this.registerData, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.toast.contrast("Cuenta creada, inicia sesión");
          this.tabActivo = 'login';
          this.cdr.detectChanges();
          setTimeout(() => {
            this.router.navigate(['/inicio']);
          }, 1000);
        },
        error: (err) => {
          this.errorMsg = err.error?.message ?? 'Error al crear la cuenta.';
        }
      });
  }

  regresar(): void {
    this.router.navigate(['/inicio']);
  }

}

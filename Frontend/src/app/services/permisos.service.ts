import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PermisosService {

  private readonly ORDEN_MODULOS = [
    'CITAS', 'CLIENTES', 'MASCOTAS', 'VENTAS', 'SERVICIOS',
    'PRODUCTOS', 'ENFERMEDADES', 'VACUNAS', 'TRABAJADORES',
    'ROLES', 'USUARIOS', 'HORARIOS', 'PAGOS', 'DASHBOARD'
  ];

  constructor(private authService: AuthService) {}

  tieneAcceso(modulo: string): boolean {
    const rol = this.authService.getRol();

    if (!rol) {
      return false;
    }

    if (rol === 'ROLE_ADMIN') {
      return true;
    }

    const modulos = this.authService.getModulos();
    if (!modulos || modulos.length === 0) {
      return false;
    }

    return modulos.includes(modulo);
  }

  tieneAccesoCrear(modulo: string): boolean {
    const rol = this.authService.getRol();
    
    // Admin puede crear
    if (rol === 'ROLE_ADMIN') {
      return true;
    }
    
    // RECEPCIONISTA no tiene delete pero sí crear
    if (rol === 'ROLE_RECEPCIONISTA') {
      return this.tieneAcceso(modulo);
    }
    
    // VET, CIRUJANO, ESTILISTA pueden crear
    if (rol === 'ROLE_VET' || rol === 'ROLE_CIRUJANO' || rol === 'ROLE_ESTILISTA') {
      return this.tieneAcceso(modulo);
    }
    
    return false;
  }

  tieneAccesoEliminar(modulo: string): boolean {
    const rol = this.authService.getRol();

    if (!rol) {
      return false;
    }

    if (rol === 'ROLE_ADMIN') {
      return true;
    }

    return false;
  }

  getPrimerModulo(): string | null {
    const rol = this.authService.getRol();

    if (!rol) {
      return null;
    }

    if (rol === 'ROLE_ADMIN') {
      return 'DASHBOARD';
    }

    const modulos = this.authService.getModulos();
    if (!modulos || modulos.length === 0) {
      return null;
    }

    for (const modulo of this.ORDEN_MODULOS) {
      if (modulos.includes(modulo)) {
        return modulo;
      }
    }

    return null;
  }
}
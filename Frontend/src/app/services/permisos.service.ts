import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PermisosService {

  private readonly ORDEN_MODULOS = [
    'DASHBOARD',
    'ROLES', 'USUARIOS', 'HORARIOS',
    'CLIENTES', 'TRABAJADORES',
    'CITAS', 'AGENDA', 'MASCOTAS', 'ENFERMEDADES', 'VACUNAS',
    'SERVICIOS', 'PRODUCTOS', 'VENTAS', 'PAGOS'
  ];

  constructor(private authService: AuthService) {}

  private getModulosUsuario(): string[] {
    const modulos = this.authService.getModulos();
    if (!modulos || modulos.length === 0) {
      return [];
    }
    return modulos;
  }

  tieneAcceso(modulo: string): boolean {
    const rol = this.authService.getRol();

    if (!rol) {
      return false;
    }

    const modulos = this.getModulosUsuario();
    if (modulos.length === 0) {
      return false;
    }

    return modulos.includes(modulo);
  }

  tieneAccesoCrear(modulo: string): boolean {
    const rol = this.authService.getRol();

    if (!rol) {
      return false;
    }

    const modulos = this.getModulosUsuario();
    if (modulos.length === 0) {
      return false;
    }

    // RECEPCIONISTA puede crear en módulos que tiene acceso
    if (rol === 'ROLE_RECEPCIONISTA') {
      return modulos.includes(modulo);
    }

    // VET, CIRUJANO, ESTILISTA pueden crear
    if (rol === 'ROLE_VET' || rol === 'ROLE_CIRUJANO' || rol === 'ROLE_ESTILISTA') {
      return modulos.includes(modulo);
    }

    return false;
  }

  tieneAccesoEliminar(modulo: string): boolean {
    const rol = this.authService.getRol();

    if (!rol) {
      return false;
    }

    const modulos = this.getModulosUsuario();
    if (modulos.length === 0) {
      return false;
    }

    return modulos.includes(modulo);
  }

  getPrimerModulo(): string | null {
    const rol = this.authService.getRol();

    if (!rol) {
      return null;
    }

    const modulos = this.getModulosUsuario();
    if (modulos.length === 0) {
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
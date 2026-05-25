import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Modulo } from '../models/modulo';

@Injectable({ providedIn: 'root' })
export class PermisosService {

  constructor(private authService: AuthService) {}

  private getModulosUsuario(): Modulo[] {
    return this.authService.getModulos() || [];
  }

  tieneAcceso(modulo: string): boolean {
    const rol = this.authService.getRol();
    if (!rol) return false;
    return this.getModulosUsuario().some(m => m.nombre === modulo);
  }

  tieneAccesoCrear(modulo: string): boolean {
    const rol = this.authService.getRol();
    if (!rol) return false;

    const modulos = this.getModulosUsuario();
    if (modulos.length === 0) return false;
    if (!modulos.some(m => m.nombre === modulo)) return false;

    if (rol === 'ROLE_RECEPCIONISTA' || rol === 'ROLE_VET' || rol === 'ROLE_CIRUJANO' || rol === 'ROLE_ESTILISTA') {
      return true;
    }

    return false;
  }

  tieneAccesoEliminar(modulo: string): boolean {
    const rol = this.authService.getRol();
    if (!rol) return false;
    return this.getModulosUsuario().some(m => m.nombre === modulo);
  }

  getPrimerModulo(): string | null {
    const modulos = this.getModulosUsuario();
    if (modulos.length === 0) return null;

    modulos.sort((a, b) => a.orden - b.orden);
    return modulos[0].nombre;
  }

  getModulosConGrupos(): { grupo: string; modulos: Modulo[] }[] {
    const ordenados = [...this.getModulosUsuario()].sort((a, b) => a.orden - b.orden);
    const grupos: { grupo: string; modulos: Modulo[] }[] = [];
    let currentGrupo = '';
    let currentList: Modulo[] = [];

    for (const m of ordenados) {
      const g = m.grupo || '';
      if (g !== currentGrupo) {
        if (currentList.length) grupos.push({ grupo: currentGrupo, modulos: currentList });
        currentGrupo = g;
        currentList = [];
      }
      currentList.push(m);
    }
    if (currentList.length) grupos.push({ grupo: currentGrupo, modulos: currentList });

    return grupos;
  }
}
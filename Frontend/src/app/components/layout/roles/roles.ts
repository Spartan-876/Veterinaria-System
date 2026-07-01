import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { Rol } from '../../../models/rol';
import { Modulo } from '../../../models/modulo';
import { RolService } from '../../../services/rol.service';
import { ModuloService } from '../../../services/modulo.service';
import { GToast } from '../../../services/gtoast';

@Component({
  selector: 'app-roles',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, PaginatorModule, TableModule, SelectModule, CheckboxModule],
  templateUrl: './roles.html',
  standalone: true
})
export class Roles implements OnInit {
  roles: Rol[] = [];
  rolesFiltrados: Rol[] = [];
  rolesMostrados: Rol[] = [];

  modulosDisponibles: Modulo[] = [];
  modulosSeleccionados: string[] = [];

  displayEdit: boolean = false;
  displayNew: boolean = false;
  displayDelete: boolean = false;

  selectedRol: Rol = {} as Rol;

  first: number = 0;
  rows: number = 8;

  constructor(
    private rolService: RolService,
    private moduloService: ModuloService,
    private toast: GToast,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.listarModulos();
      this.listarRoles();
    });
  }

  listarModulos(): void {
    this.moduloService.listar().subscribe({
      next: (data: any) => {
        this.modulosDisponibles = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => this.toast.error('Error al listar módulos')
    });
  }

  listarRoles(): void {
    this.rolService.listar().subscribe({
      next: (data: any) => {
        this.roles = data;
        this.rolesFiltrados = data;
        this.actualizarVista();
        this.cdr.detectChanges();
      },
      error: (err: any) => this.toast.error('Error al listar roles')
    });
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.actualizarVista();
  }

  actualizarVista(): void {
    this.rolesMostrados = this.rolesFiltrados.slice(this.first, this.first + this.rows);
  }

  abrirNuevo(): void {
    this.selectedRol = {} as Rol;
    this.modulosSeleccionados = [];
    this.displayNew = true;
  }

  abrirEditar(rol: Rol): void {
    this.selectedRol = { ...rol };
    this.modulosSeleccionados = rol.modulos ? [...rol.modulos] : [];
    this.displayEdit = true;
  }

  abrirEliminar(rol: Rol): void {
    this.selectedRol = rol;
    this.displayDelete = true;
  }

  guardarNuevo(): void {
    if (!this.selectedRol.nombre) {
      this.toast.warn('Ingrese el nombre del rol');
      return;
    }

    const rolData = {
      nombre: this.selectedRol.nombre,
      modulos: this.modulosSeleccionados
    };

    this.rolService.crear(rolData).subscribe({
      next: () => {
        this.displayNew = false;
        this.listarRoles();
        this.toast.success('Rol creado correctamente');
      },
      error: (err: any) => this.toast.error('Error al crear rol')
    });
  }

  guardarCambios(): void {
    if (!this.selectedRol.nombre || !this.selectedRol.id) {
      this.toast.warn('Ingrese el nombre del rol');
      return;
    }

    const rolData = {
      nombre: this.selectedRol.nombre,
      modulos: this.modulosSeleccionados
    };

    this.rolService.actualizar(this.selectedRol.id, rolData).subscribe({
      next: () => {
        this.displayEdit = false;
        this.listarRoles();
        this.toast.success('Rol actualizado correctamente');
      },
      error: (err: any) => this.toast.error('Error al actualizar rol')
    });
  }

  confirmarEliminar(): void {
    if (!this.selectedRol.id) return;
    this.rolService.eliminar(this.selectedRol.id).subscribe({
      next: () => {
        this.displayDelete = false;
        this.listarRoles();
        this.toast.success('Rol desactivado correctamente');
      },
      error: (err: any) => this.toast.error('Error al desactivar rol')
    });
  }
}
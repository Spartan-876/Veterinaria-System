import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { Rol } from '../../../models/rol';
import { RolService } from '../../../services/rol.service';
import { GToast } from '../../../services/gtoast';

@Component({
  selector: 'app-roles',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, PaginatorModule, TableModule],
  templateUrl: './roles.html',
  standalone: true
})
export class Roles implements OnInit {
  roles: Rol[] = [];
  rolesFiltrados: Rol[] = [];
  rolesMostrados: Rol[] = [];

  displayEdit: boolean = false;
  displayNew: boolean = false;
  displayDelete: boolean = false;

  selectedRol: Rol = {} as Rol;

  first: number = 0;
  rows: number = 8;

  constructor(private rolService: RolService, private toast: GToast, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.listarRoles();
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
    this.displayNew = true;
  }

  abrirEditar(rol: Rol): void {
    this.selectedRol = { ...rol };
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

    this.rolService.crear(this.selectedRol).subscribe({
      next: () => {
        this.displayNew = false;
        this.listarRoles();
        this.toast.success('Rol creado correctamente');
      },
      error: (err: any) => this.toast.error('Error al crear rol')
    });
  }

  guardarCambios(): void {
    if (!this.selectedRol.nombre) {
      this.toast.warn('Ingrese el nombre del rol');
      return;
    }

    this.rolService.actualizar(this.selectedRol.id, this.selectedRol).subscribe({
      next: () => {
        this.displayEdit = false;
        this.listarRoles();
        this.toast.success('Rol actualizado correctamente');
      },
      error: (err: any) => this.toast.error('Error al actualizar rol')
    });
  }

  confirmarEliminar(): void {
    this.rolService.eliminar(this.selectedRol.id).subscribe({
      next: () => {
        this.displayDelete = false;
        this.listarRoles();
        this.toast.success('Rol eliminado correctamente');
      },
      error: (err: any) => this.toast.error('Error al eliminar rol')
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { Trabajador } from '../../../models/trabajador';
import { TrabajadorService } from '../../../services/trabajador-service';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { GToast} from '../../../services/gtoast';
import {environment} from '../../../../environments/environment';


@Component({
  selector: 'app-trabajadores',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, PaginatorModule, TableModule],
  templateUrl: './trabajadores.html',
  standalone: true
})
export class Trabajadores implements OnInit {
  trabajadores: Trabajador[] = [];
  trabajadoresMostrados: Trabajador[] = [];
  trabajadoresFiltrados: Trabajador[] = [];
  terminoBusqueda: string = '';

  //modales
  displayEdit: boolean = false;
  displayDelete: boolean = false;
  displayNew: boolean = false;

  //trabajador seleccionada
  selectedTrabajador: Trabajador = {} as Trabajador;

  //paginacion
  first: number = 0;
  rows: number = 8;

  constructor(private trabajadorService: TrabajadorService, private cdr: ChangeDetectorRef, private http :HttpClient , private toast : GToast) { }

  ngOnInit(): void {
    this.listarTrabajadores();
  }

  listarTrabajadores() {
    this.trabajadorService.listarTrabajadores().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.trabajadores = data;
          this.filtrar();
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => console.error('Error:', err)
    });
  }

  filtrar(): void {
    const termino = this.terminoBusqueda.toLowerCase();
    this.trabajadoresFiltrados = this.trabajadores.filter(t =>
      t.nombres.toLowerCase().includes(termino) ||
      t.apellidos.toLowerCase().includes(termino) ||
      t.dni.includes(termino) ||
      t.cargo.toLowerCase().includes(termino)
    );
    this.first = 0;
    this.actualizarVista();
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.actualizarVista();
  }

  actualizarVista(): void {
    this.trabajadoresMostrados = this.trabajadoresFiltrados.slice(this.first, this.first + this.rows);
  }

  abrirEditar(trabajador: Trabajador): void {
    this.selectedTrabajador = {
      ...trabajador,
    };
    this.displayEdit = true;
  }

  abrirNuevo(): void {
    this.selectedTrabajador = {} as Trabajador;
    this.displayNew = true;
  }

  guardarCambios(): void {
    const request = {
      nombres: this.selectedTrabajador.nombres,
      apellidos: this.selectedTrabajador.apellidos,
      cargo: this.selectedTrabajador.cargo,
      estado: this.selectedTrabajador.estado,
      correo: this.selectedTrabajador.correo,
      dni: this.selectedTrabajador.dni,
      telefono: this.selectedTrabajador.telefono,
    };
    console.log('Request enviado:', request);

    this.http.put(`${environment.apiUrl}/api/trabajadores/${this.selectedTrabajador.id}`, request)
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.displayEdit = false;
            this.listarTrabajadores();
            this.cdr.detectChanges();
          }, 0);
        },
        error: (err) => console.error(err)
      });
    this.toast.success("Trabajador actualizado")
  }

  toggleEstado(trabajador: Trabajador): void {
    const nuevoEstado = trabajador.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    const request = {
      nombres: trabajador.nombres,
      apellidos: trabajador.apellidos,
      cargo: trabajador.cargo,
      estado: nuevoEstado,
      dni: trabajador.dni,
      telefono: trabajador.telefono,
      correo: trabajador.correo,
    };

    this.http.put(`${environment.apiUrl}/api/trabajadores/${trabajador.id}`, request)
      .subscribe({
        next: () => {
          trabajador.estado = nuevoEstado;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.toast.error("Error al cambiar estado");
        }
      });
  }

  generarCorreo(): void {
    const nombres = this.selectedTrabajador.nombres?.trim() || '';
    const apellidos = this.selectedTrabajador.apellidos?.trim() || '';

    if (!nombres || !apellidos) {
      this.toast.warn("Ingresa nombres y apellidos primero");
      return;
    }

    const primerNombre = this.normalizarTexto(nombres.split(' ')[0]);
    const primerApellido = this.normalizarTexto(apellidos.split(' ')[0]);

    const username = `${primerNombre}.${primerApellido}`.toLowerCase();
    const correo = `${username}@vethuellitas.com`;

    this.selectedTrabajador.correo = correo;
  }

  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  }

  guardarNuevo(): void {
    const request = {
      nombres: this.selectedTrabajador.nombres.toUpperCase(),
      apellidos: this.selectedTrabajador.apellidos.toUpperCase(),
      cargo: this.selectedTrabajador.cargo,
      estado: this.selectedTrabajador.estado,
      correo: this.selectedTrabajador.correo,
      dni: this.selectedTrabajador.dni,
      telefono: this.selectedTrabajador.telefono,
    };

    this.http.post(`${environment.apiUrl}/api/trabajadores`, request)
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.displayNew = false;
            this.listarTrabajadores();
            this.cdr.detectChanges();
          }, 0);
          this.toast.success("Trabajador guardado correctamente");
        },
        error: (err) => this.toast.error("Error al guardar el trabajador")
      });
  }
}

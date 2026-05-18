import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Servicio } from '../../../models/servicios';
import { ServiciosService } from '../../../services/servicios';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { GToast } from '../../../services/gtoast';
import {HttpClient} from '@angular/common/http';
import {Trabajador} from '../../../models/trabajador';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, PaginatorModule, TableModule],
  templateUrl: './servicios.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Servicios implements OnInit {
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];
  serviciosMostrados: Servicio[] = [];
  trabajadores: Trabajador[] = [];              // ✅ lista para el selector
  trabajadoresSeleccionados: Trabajador[] = []; // ✅ los que se asignan

  terminoBusqueda: string = '';
  displayEdit: boolean = false;
  displayNew: boolean = false;
  selectedServicio: Servicio = {} as Servicio;
  first: number = 0;
  rows: number = 10;

  constructor(
    private servicioService: ServiciosService,
    private cdr: ChangeDetectorRef,
    private toast: GToast,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarTrabajadores();
  }

  cargarServicios(): void {
    this.servicioService.listar().subscribe({
      next: (data) => {
        this.servicios = data;
        this.filtrar();
        this.cdr.markForCheck(); // ✅ con OnPush se usa markForCheck, no detectChanges
      },
      error: (err) => console.error('Error: ', err)
    });
  }

  cargarTrabajadores(): void {
    this.http.get<Trabajador[]>(`${environment.apiUrl}/api/trabajadores`).subscribe({
      next: (data) => {
        this.trabajadores = data.filter(t =>
          t.estado === 'ACTIVO' &&
          (t.cargo === 'VETERINARIO' || t.cargo === 'CIRUJANO' || t.cargo === 'ESTILISTA')
        );
        this.cdr.markForCheck(); // ✅
      },
      error: (err) => console.error(err)
    });
  }

  filtrar(): void {
    this.serviciosFiltrados = this.servicios.filter(v =>
      v.nombre.toLocaleLowerCase().
      includes(this.terminoBusqueda.toLocaleLowerCase()));
    this.first = 0;
    this.actualizarVista();
  }

  actualizarVista(): void {
    this.serviciosMostrados = this.serviciosFiltrados.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.actualizarVista();
  }

  abrirNuevo(): void {
    this.selectedServicio = {} as Servicio;
    this.trabajadoresSeleccionados = [];
    this.displayNew = true;
  }

  abrirEditar(servicio: Servicio): void {
    console.log('trabajadores del servicio:', servicio.trabajadores);
    console.log('trabajadores disponibles:', this.trabajadores);
    this.selectedServicio = { ...servicio };
    this.trabajadoresSeleccionados = this.trabajadores.filter(t =>
      servicio.trabajadores?.some(ts => ts.trabajador?.id === t.id)
    );
    this.cdr.markForCheck();
    this.displayEdit = true;
  }

  guardarNuevo(): void {
    const request = {
      nombre: this.selectedServicio.nombre,
      descripcion: this.selectedServicio.descripcion,
      icono: this.selectedServicio.icono || 'pets',
      precio: this.selectedServicio.precio,
      estado: this.selectedServicio.estado || 'ACTIVO',
      trabajadorIds: this.trabajadoresSeleccionados.map(t => t.id) // ✅
    };

    this.http.post(`${environment.apiUrl}/api/servicios`, request).subscribe({
      next: () => {
        this.displayNew = false;
        this.cargarServicios();
        this.toast.success("Servicio creado");
        this.cdr.markForCheck();
      }
    });
  }

  guardarCambios(): void {
    if (!this.selectedServicio.id) {
      this.toast.error("ID de servicio no válido");
      return;
    }

    const request = {
      nombre: this.selectedServicio.nombre,
      descripcion: this.selectedServicio.descripcion,
      icono: this.selectedServicio.icono || 'pets',
      precio: this.selectedServicio.precio,
      estado: this.selectedServicio.estado,
      trabajadorIds: this.trabajadoresSeleccionados.map(t => t.id)
    };

    this.http.put(`${environment.apiUrl}/api/servicios/${this.selectedServicio.id}`, request).subscribe({
      next: () => {
        this.displayEdit = false;
        this.cargarServicios();
        this.toast.success("Servicio actualizado");
        this.cdr.markForCheck(); // ✅
      }
    });
  }

  toggleTrabajador(t: Trabajador): void {
    const idx = this.trabajadoresSeleccionados.findIndex(x => x.id === t.id);
    if (idx === -1) {
      this.trabajadoresSeleccionados.push(t);
    } else {
      this.trabajadoresSeleccionados.splice(idx, 1);
    }
  }

  estaSeleccionado(t: Trabajador): boolean {
    return this.trabajadoresSeleccionados.some(x => x.id === t.id);
  }
}

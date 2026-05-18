import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { MascotasService } from '../../../services/mascotas-service';
import { ClienteService } from '../../../services/cliente-service';
import { Mascota } from '../../../models/mascota';
import { Cliente } from '../../../models/cliente';
import { GToast } from '../../../services/gtoast';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [TableModule, InputTextModule, ButtonModule, PaginatorModule,
    DialogModule, FormsModule, CommonModule],
  templateUrl: './mascotas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Mascotas implements OnInit {

  mascotas: Mascota[] = [];
  mascotasFiltradas: Mascota[] = [];
  mascotasMostradas: Mascota[] = [];
  clientes: Cliente[] = [];

  terminoBusqueda = '';

  displayEdit = false;
  displayNew = false;
  displayDelete = false;
  displayHistorial = false;

  mascotaSeleccionada: Mascota = this.mascotaVacia();
  clienteIdSeleccionado: number | null = null;

  first = 0;
  rows = 8;

  readonly especies = ['Canina', 'Felina'];
  readonly sexos = ['Macho', 'Hembra'];

  constructor(
    private mascotasService: MascotasService,
    private clienteService: ClienteService,
    private toast: GToast,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMascotas();
    this.cargarClientes();
  }

  private mascotaVacia(): Mascota {
    return { nombre: '', especie: 'Canina', raza: '', sexo: 'Macho', edad: '', peso: 0 };
  }

  cargarMascotas(): void {
    this.mascotasService.listarMascotas().subscribe({
      next: (data) => {
        Promise.resolve().then(() => {
          this.mascotas = data;
          this.filtrar();
          this.cdr.markForCheck();
        });
      },
      error: (err) => console.error('Error:', err)
    });
  }

  cargarClientes(): void {
    this.clienteService.listarClientes().subscribe({
      next: (data) => {
        Promise.resolve().then(() => {
          this.clientes = data;
          this.cdr.markForCheck();
        });
      }
    });
  }

  filtrar(): void {
    const t = this.terminoBusqueda.toLowerCase();
    this.mascotasFiltradas = this.mascotas.filter(m =>
      m.nombre.toLowerCase().includes(t) ||
      (m.cliente?.nombres ?? '').toLowerCase().includes(t) ||
      (m.cliente?.apellidos ?? '').toLowerCase().includes(t)
    );
    this.first = 0;
    this.actualizarVista();
  }

  actualizarVista(): void {
    this.mascotasMostradas = this.mascotasFiltradas.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.actualizarVista();
  }

  abrirNuevo(): void {
    this.mascotaSeleccionada = this.mascotaVacia();
    this.clienteIdSeleccionado = null;
    this.displayNew = true;
  }

  abrirEditar(mascota: Mascota): void {
    this.mascotaSeleccionada = { ...mascota };
    this.clienteIdSeleccionado = mascota.cliente?.id ?? null;
    this.displayEdit = true;
  }

  abrirEliminar(mascota: Mascota): void {
    this.mascotaSeleccionada = { ...mascota };
    this.displayDelete = true;
  }

  verHistorial(mascota: Mascota): void {
    this.mascotaSeleccionada = { ...mascota };
    this.displayHistorial = true;
  }

  guardarNuevo(): void {
    if (!this.clienteIdSeleccionado) {
      this.toast.warn('Selecciona un cliente responsable');
      return;
    }
    const payload: Mascota = {
      ...this.mascotaSeleccionada,
      cliente: { id: this.clienteIdSeleccionado }
    };
    this.mascotasService.crearMascota(payload).subscribe({
      next: () => {
        this.toast.success('Mascota registrada');
        this.displayNew = false;
        this.cargarMascotas();
        this.cdr.markForCheck();
      },
      error: () => this.toast.error('Error al registrar mascota')
    });
  }

  guardarEdicion(): void {
    if (!this.clienteIdSeleccionado) {
      this.toast.warn('Selecciona un cliente responsable');
      return;
    }
    const payload: Mascota = {
      ...this.mascotaSeleccionada,
      cliente: { id: this.clienteIdSeleccionado }
    };
    this.mascotasService.actualizarMascota(payload).subscribe({
      next: () => {
        this.toast.success('Mascota actualizada');
        this.displayEdit = false;
        this.cargarMascotas();
        this.cdr.markForCheck();
      },
      error: () => this.toast.error('Error al actualizar mascota')
    });
  }

  eliminar(): void {
    this.mascotasService.eliminarMascota(this.mascotaSeleccionada.id!).subscribe({
      next: () => {
        this.toast.success('Mascota eliminada');
        this.displayDelete = false;
        this.cargarMascotas();
        this.cdr.markForCheck();
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }
}

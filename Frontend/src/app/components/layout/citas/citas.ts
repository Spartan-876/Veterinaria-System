// components/layout/citas/citas.ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Cita } from '../../../models/cita';
import { CitasService } from '../../../services/citas-service';
import { GToast } from '../../../services/gtoast';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [FormsModule, CommonModule, DialogModule, ButtonModule, InputTextModule, TableModule],
  templateUrl: './citas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Citas implements OnInit {
  citas: Cita[] = [];
  terminoBusqueda = '';
  filtroEstado = '';
  citaDetalle: Cita | null = null;
  displayDetalle = false;

  readonly estados = ['PENDIENTE', 'CONFIRMADA', 'REALIZADA', 'CANCELADA'];

  constructor(
    private citaService: CitasService,
    private toast: GToast,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listarCitas();
  }

  listarCitas(): void {
    this.citaService.listarCitas().subscribe({
      next: (data) => {
        Promise.resolve().then(() => {
          this.citas = data.sort((a, b) =>
            new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
          );
          this.cdr.markForCheck();
        });
      },
      error: (err) => console.error('Error', err)
    });
  }

  get citasFiltradas(): Cita[] {
    const t = this.terminoBusqueda.toLowerCase();
    return this.citas.filter(c => {
      const coincideTexto = !t ||
        c.servicioNombre?.toLowerCase().includes(t) ||
        c.mascotaNombre?.toLowerCase().includes(t) ||
        c.clienteNombre?.toLowerCase().includes(t) ||
        c.trabajadorNombre?.toLowerCase().includes(t);
      const coincideEstado = !this.filtroEstado || c.estado === this.filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }

  verDetalle(cita: Cita): void {
    this.citaDetalle = cita;
    this.displayDetalle = true;
  }

  cambiarEstado(cita: Cita, estado: string): void {
    this.citaService.cambiarEstado(cita.id!, estado).subscribe({
      next: (actualizada) => {
        const idx = this.citas.findIndex(c => c.id === cita.id);
        if (idx >= 0) this.citas[idx] = actualizada;
        this.citas = [...this.citas];
        if (this.citaDetalle?.id === cita.id) this.citaDetalle = actualizada;
        this.toast.success('Estado actualizado');
        this.cdr.markForCheck();
      },
      error: () => this.toast.error('Error al cambiar estado')
    });
  }

  // Stats
  get citasHoy(): number {
    const hoy = new Date().toDateString();
    return this.citas.filter(c => new Date(c.fechaHora).toDateString() === hoy).length;
  }

  get citasPendientes(): number {
    return this.citas.filter(c => c.estado === 'PENDIENTE').length;
  }

  get citasConfirmadas(): number {
    return this.citas.filter(c => c.estado === 'CONFIRMADA').length;
  }
}

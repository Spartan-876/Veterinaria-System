// components/inicio/mis-citas/mis-citas.ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CitasService } from '../../../services/citas-service';
import { Cita } from '../../../models/cita';
import { GToast } from '../../../services/gtoast';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-citas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisCitas implements OnInit {
  citas: Cita[] = [];
  cargando = true;
  filtroEstado = '';

  constructor(
    private citaService: CitasService,
    private toast: GToast,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const clienteId = Number(localStorage.getItem('clienteId'));
    if (!clienteId) return;

    this.citaService.listarPorCliente(clienteId).subscribe({
      next: (data) => {
        Promise.resolve().then(() => {
          this.citas = data.sort((a, b) =>
            new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
          );
          this.cargando = false;
          this.cdr.markForCheck();
        });
      },
      error: () => { this.cargando = false; this.cdr.markForCheck(); }
    });
  }

  get citasFiltradas(): Cita[] {
    if (!this.filtroEstado) return this.citas;
    return this.citas.filter(c => c.estado === this.filtroEstado);
  }

  cancelar(cita: Cita): void {
    if (!confirm(`¿Cancelar la cita del ${new Date(cita.fechaHora).toLocaleDateString()}?`)) return;

    this.citaService.cancelarCita(cita.id!).subscribe({
      next: (actualizada) => {
        const idx = this.citas.findIndex(c => c.id === cita.id);
        if (idx >= 0) this.citas[idx] = actualizada;
        this.citas = [...this.citas];
        this.toast.success('Cita cancelada');
        this.cdr.markForCheck();
      },
      error: () => this.toast.error('Error al cancelar la cita')
    });
  }

  puedeCancelar(cita: Cita): boolean {
    return cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA';
  }
  get proximasCitas(): number {
    return this.citas.filter(c =>
      (c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA') &&
      new Date(c.fechaHora) > new Date()
    ).length;
  }
}

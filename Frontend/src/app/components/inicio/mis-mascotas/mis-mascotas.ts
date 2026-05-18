// components/inicio/mis-mascotas/mis-mascotas.ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MascotasService } from '../../../services/mascotas-service';
import { Mascota } from '../../../models/mascota';
import { GToast } from '../../../services/gtoast';

@Component({
  selector: 'app-mis-mascotas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './mis-mascotas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisMascotas implements OnInit {
  mascotas: Mascota[] = [];
  cargando = true;
  displayNew = false;
  displayDelete = false;
  mascotaSeleccionada: Mascota = this.mascotaVacia();

  readonly especies = ['Canina', 'Felina'];
  readonly sexos = ['Macho', 'Hembra'];

  constructor(
    private mascotasService: MascotasService,
    private toast: GToast,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const clienteId = Number(localStorage.getItem('clienteId'));
    if (!clienteId) return;

    this.mascotasService.listarPorCliente(clienteId).subscribe({
      next: (data) => {
        Promise.resolve().then(() => {
          this.mascotas = data;
          this.cargando = false;
          this.cdr.markForCheck();
        });
      },
      error: () => { this.cargando = false; this.cdr.markForCheck(); }
    });
  }

  private mascotaVacia(): Mascota {
    return { nombre: '', especie: 'Canina', raza: '', sexo: 'Macho', edad: '', peso: 0 };
  }

  abrirNuevo(): void {
    this.mascotaSeleccionada = this.mascotaVacia();
    this.displayNew = true;
  }

  confirmarEliminar(m: Mascota): void {
    this.mascotaSeleccionada = { ...m };
    this.displayDelete = true;
  }

  guardarNuevo(): void {
    const clienteId = Number(localStorage.getItem('clienteId'));
    const payload: Mascota = {
      ...this.mascotaSeleccionada,
      cliente: { id: clienteId }
    };
    this.mascotasService.crearMascota(payload).subscribe({
      next: (nueva) => {
        this.mascotas = [...this.mascotas, nueva];
        this.toast.success(`${nueva.nombre} registrada`);
        this.displayNew = false;
        this.cdr.markForCheck();
      },
      error: () => this.toast.error('Error al registrar mascota')
    });
  }

  eliminar(): void {
    this.mascotasService.eliminarMascota(this.mascotaSeleccionada.id!).subscribe({
      next: () => {
        this.mascotas = this.mascotas.filter(m => m.id !== this.mascotaSeleccionada.id);
        this.toast.success('Mascota eliminada');
        this.displayDelete = false;
        this.cdr.markForCheck();
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }
}

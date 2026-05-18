// components/inicio/agendar-cita/agendar-cita.ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CitasService } from '../../../services/citas-service';
import { ServiciosService } from '../../../services/servicios';
import { Servicio } from '../../../models/servicios';
import { Mascota, TrabajadorDisponible } from '../../../models/cita';
import { GToast } from '../../../services/gtoast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './agendar-cita.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgendarCita implements OnInit {

  // Paso actual (1-4)
  paso = 1;

  // Datos del formulario
  servicioSeleccionado: Servicio | null = null;
  mascotaSeleccionada: Mascota | null = null;
  trabajadorSeleccionado: TrabajadorDisponible | null = null;
  fechaHora = '';
  motivo = '';

  // Listas
  servicios: Servicio[] = [];
  mascotas: Mascota[] = [];
  trabajadoresDisponibles: TrabajadorDisponible[] = [];

  // Estados
  cargandoTrabajadores = false;
  enviando = false;
  exitoso = false;
  estaLogueado = false;

  readonly fechaMin: string;

  constructor(
    private citaService: CitasService,
    private servicioService: ServiciosService,
    private toast: GToast,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Mínimo: mañana
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    manana.setHours(8, 0, 0, 0);
    this.fechaMin = manana.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    const clienteId = localStorage.getItem('clienteId');
    this.estaLogueado = !!clienteId;

    this.servicioService.listarActivos().subscribe({
      next: (data) => {
        Promise.resolve().then(() => {
          this.servicios = data;
          this.cdr.markForCheck();
        });
      }
    });

    if (clienteId) {
      this.citaService.mascotasPorCliente(Number(clienteId)).subscribe({
        next: (data) => {
          Promise.resolve().then(() => {
            this.mascotas = data;

            if (data.length === 0) {
              this.toast.warn('Registra una mascota antes de agendar');
              this.router.navigate(['/mis-mascotas']);
              return;
            }

            this.cdr.markForCheck();
          });
        }
      });
    }

  }

  // ── Paso 1: elegir servicio ──────────────────────────
  elegirServicio(s: Servicio): void {
    this.servicioSeleccionado = s;
    this.trabajadorSeleccionado = null;
    this.trabajadoresDisponibles = [];
  }

  // ── Paso 2: elegir mascota ───────────────────────────
  elegirMascota(m: Mascota): void {
    this.mascotaSeleccionada = m;
  }

  // ── Paso 3: fecha + buscar trabajadores disponibles ─
  buscarTrabajadores(): void {
    if (!this.fechaHora || !this.servicioSeleccionado) return;

    this.cargandoTrabajadores = true;
    this.trabajadorSeleccionado = null;

    this.citaService.trabajadoresDisponibles(
      this.servicioSeleccionado.id!,
      this.fechaHora
    ).subscribe({
      next: (data) => {
        this.trabajadoresDisponibles = data;
        this.cargandoTrabajadores = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargandoTrabajadores = false;
        this.toast.error('Error al buscar disponibilidad');
        this.cdr.markForCheck();
      }
    });
  }

  elegirTrabajador(t: TrabajadorDisponible): void {
    this.trabajadorSeleccionado = t;
  }

  // ── Paso 4: confirmar ────────────────────────────────
  confirmar(): void {
    if (!this.servicioSeleccionado || !this.mascotaSeleccionada ||
      !this.trabajadorSeleccionado || !this.fechaHora || !this.motivo.trim()) {
      this.toast.warn('Completa todos los campos');
      return;
    }

    this.enviando = true;
    const dto = {
      mascotaId: this.mascotaSeleccionada.id,
      servicioId: this.servicioSeleccionado.id!,
      trabajadorId: this.trabajadorSeleccionado.id,
      fechaHora: this.fechaHora,
      motivo: this.motivo,
    };

    this.citaService.crearCita(dto).subscribe({
      next: () => {
        this.enviando = false;
        this.exitoso = true;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.enviando = false;
        this.toast.error(err.error?.message ?? 'Error al agendar la cita');
        this.cdr.markForCheck();
      }
    });
  }

  siguientePaso(): void {
    if (this.paso === 1 && !this.servicioSeleccionado) {
      this.toast.warn('Selecciona un servicio'); return;
    }
    if (this.paso === 2 && !this.mascotaSeleccionada) {
      this.toast.warn('Selecciona una mascota'); return;
    }
    if (this.paso === 3) {
      if (!this.fechaHora) { this.toast.warn('Selecciona fecha y hora'); return; }
      if (!this.trabajadorSeleccionado) { this.toast.warn('Selecciona un profesional'); return; }
    }
    this.paso++;
  }

  anteriorPaso(): void {
    if (this.paso > 1) this.paso--;
  }

  irAMisCitas(): void {
    this.router.navigate(['/mis-citas']);
  }
}

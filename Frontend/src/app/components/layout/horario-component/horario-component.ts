import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { Trabajador } from '../../../models/trabajador';
import { GToast } from '../../../services/gtoast';
import {DIAS_SEMANA, DiaSemana, Horario} from '../../../models/horario';
import {HorarioService} from '../../../services/horario-service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-horario-component',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule],
  templateUrl: './horario-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HorarioComponent implements OnInit {
  trabajadores: Trabajador[] = [];
  trabajadoresFiltrados: Trabajador[] = [];
  horariosPorTrabajador: Map<number, Horario[]> = new Map();

  terminoBusqueda = '';
  filtroTrabajador = '';

  // Modal
  displayModal = false;
  modoEdicion = false;
  trabajadorSeleccionadoId: number | null = null;

  // Formulario
  horarioForm: Partial<Horario> = {};
  horarioEditandoId: number | null = null;

  readonly diasSemana = DIAS_SEMANA;

  constructor(
    private http: HttpClient,
    private horarioService: HorarioService,
    private toast: GToast,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTrabajadores();
  }

  cargarTrabajadores(): void {
    this.http.get<Trabajador[]>(`${environment.apiUrl}/api/trabajadores`).subscribe({
      next: (data) => {
        Promise.resolve().then(() => {
          this.trabajadores = data;
          this.trabajadoresFiltrados = data;
          this.cargarTodosLosHorarios();
        });
      },
      error: (err) => console.error(err),
    });
  }

  cargarTodosLosHorarios(): void {
    this.trabajadores.forEach((t) => {
      if (t.id) {
        this.horarioService.porTrabajador(t.id).subscribe({
          next: (horarios) => {
            this.horariosPorTrabajador.set(t.id!, horarios);
            this.cdr.markForCheck();
          },
          error: (err) => console.error(err),
        });
      }
    });
  }

  filtrar(): void {
    const termino = this.terminoBusqueda.toLowerCase();
    this.trabajadoresFiltrados = this.trabajadores.filter((t) => {
      const coincideNombre =
        t.nombres.toLowerCase().includes(termino) ||
        t.apellidos.toLowerCase().includes(termino);
      const coincideCargo =
        !this.filtroTrabajador || t.cargo === this.filtroTrabajador;
      return coincideNombre && coincideCargo;
    });
    this.cdr.markForCheck();
  }

  getHorarios(trabajadorId: number): Horario[] {
    return this.horariosPorTrabajador.get(trabajadorId) || [];
  }

  getHorariosDia(trabajadorId: number, dia: DiaSemana): Horario[] {
    return this.getHorarios(trabajadorId).filter(
      (h) => h.diaSemana === dia && h.activo !== false
    );
  }

  calcularHorasSemana(trabajadorId: number): number {
    const horarios = this.getHorarios(trabajadorId).filter(
      (h) => h.activo !== false
    );
    let total = 0;
    horarios.forEach((h) => {
      const [hi, mi] = h.horaInicio.split(':').map(Number);
      const [hf, mf] = h.horaFin.split(':').map(Number);
      total += hf * 60 + mf - (hi * 60 + mi);
    });
    return Math.round((total / 60) * 10) / 10;
  }

  abrirNuevoTurno(trabajadorId: number): void {
    this.trabajadorSeleccionadoId = trabajadorId;
    this.modoEdicion = false;
    this.horarioForm = { diaSemana: 'MONDAY', horaInicio: '', horaFin: '' };
    this.horarioEditandoId = null;
    this.displayModal = true;
  }

  abrirEditarTurno(horario: Horario): void {
    this.trabajadorSeleccionadoId = horario.trabajadorId;
    this.modoEdicion = true;
    this.horarioForm = {
      diaSemana: horario.diaSemana,
      horaInicio: horario.horaInicio.substring(0, 5),
      horaFin: horario.horaFin.substring(0, 5),
    };
    this.horarioEditandoId = horario.id!;
    this.displayModal = true;
  }

  guardar(): void {
    if (
      !this.horarioForm.diaSemana ||
      !this.horarioForm.horaInicio ||
      !this.horarioForm.horaFin
    ) {
      this.toast.warn('Completa todos los campos');
      return;
    }

    if (this.horarioForm.horaInicio >= this.horarioForm.horaFin) {
      this.toast.warn('La hora de inicio debe ser menor a la hora fin');
      return;
    }

    const payload: Horario = {
      trabajadorId: this.trabajadorSeleccionadoId!,
      diaSemana: this.horarioForm.diaSemana as DiaSemana,
      horaInicio: this.horarioForm.horaInicio,
      horaFin: this.horarioForm.horaFin,
      activo: true,
    };

    if (this.modoEdicion && this.horarioEditandoId) {
      this.horarioService.actualizar(this.horarioEditandoId, payload).subscribe({
        next: () => {
          this.toast.success('horario.ts actualizado');
          this.displayModal = false;
          this.recargarHorariosTrabajador(this.trabajadorSeleccionadoId!);
        },
        error: () => this.toast.error('Error al actualizar horario'),
      });
    } else {
      this.horarioService.crear(payload).subscribe({
        next: () => {
          this.toast.success('Turno creado');
          this.displayModal = false;
          this.recargarHorariosTrabajador(this.trabajadorSeleccionadoId!);
        },
        error: () => this.toast.error('Error al crear turno'),
      });
    }
  }

  eliminarTurno(horario: Horario): void {
    if (!confirm('¿Eliminar este turno?')) return;
    this.horarioService.eliminar(horario.id!).subscribe({
      next: () => {
        this.toast.success('Turno eliminado');
        this.recargarHorariosTrabajador(horario.trabajadorId);
      },
      error: () => this.toast.error('Error al eliminar'),
    });
  }

  private recargarHorariosTrabajador(trabajadorId: number): void {
    this.horarioService.porTrabajador(trabajadorId).subscribe({
      next: (horarios) => {
        this.horariosPorTrabajador.set(trabajadorId, horarios);
        this.cdr.markForCheck();
      },
    });
  }

  getTrabajadorNombre(id: number): string {
    const t = this.trabajadores.find((x) => x.id === id);
    return t ? `${t.nombres} ${t.apellidos}` : '';
  }

  getInicialCargo(cargo: string): string {
    const map: Record<string, string> = {
      VETERINARIO: 'VET',
      CIRUJANO: 'CIR',
      ESTILISTA: 'EST',
      RECEPCIONISTA: 'REC',
    };
    return map[cargo] || cargo;
  }
}

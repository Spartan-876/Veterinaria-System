// components/layout/citas/citas.ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Cita } from '../../../models/cita';
import { CitasService } from '../../../services/citas-service';
import { ClienteService } from '../../../services/cliente-service';
import { ServiciosService } from '../../../services/servicios';
import { Cliente } from '../../../models/cliente';
import { Servicio } from '../../../models/servicios';
import { Mascota, TrabajadorDisponible } from '../../../models/cita';
import { GToast } from '../../../services/gtoast';
import { PdfService } from '../../../services/pdf-service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [FormsModule, CommonModule, DialogModule, ButtonModule, InputTextModule, TableModule, SelectModule, RadioButtonModule],
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

  private readonly transicionesValidas: Record<string, string[]> = {
    PENDIENTE: ['CONFIRMADA', 'CANCELADA'],
    CONFIRMADA: ['REALIZADA'],
    REALIZADA: [],
    CANCELADA: [],
  };

  // Crear cita
  displayCrear = false;
  clientes: Cliente[] = [];
  servicios: Servicio[] = [];
  mascotas: Mascota[] = [];
  trabajadoresDisponibles: TrabajadorDisponible[] = [];
  cargandoTrabajadores = false;
  creando = false;
  clienteSel: Cliente | null = null;
  mascotaSel: Mascota | null = null;
  servicioSel: Servicio | null = null;
  trabajadorSel: TrabajadorDisponible | null = null;
  fechaHora = '';
  motivo = '';

  readonly fechaMin: string;

  // Modal pago
  displayPago = false;
  citaPago: Cita | null = null;
  metodoPagoSel = 'EFECTIVO';
  readonly metodosPago = ['EFECTIVO', 'TARJETA', 'YAPE', 'PLIN'];
  pagando = false;

  constructor(
    private citaService: CitasService,
    private clienteService: ClienteService,
    private servicioService: ServiciosService,
    private pdfService: PdfService,
    private toast: GToast,
    private cdr: ChangeDetectorRef
  ) {
    const min = new Date();
    min.setHours(min.getHours() + 1, 0, 0, 0);
    this.fechaMin = min.toISOString().slice(0, 16);
  }

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

  getNextEstados(actual: string): string[] {
    return this.transicionesValidas[actual] ?? [];
  }

  // ── Crear cita ──────────────────────────────────────

  abrirCrear(): void {
    this.resetForm();
    this.displayCrear = true;
    this.clienteService.listarClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cdr.markForCheck();
      }
    });
    this.servicioService.listarActivos().subscribe({
      next: (data) => {
        this.servicios = data;
        this.cdr.markForCheck();
      }
    });
  }

  onClienteChange(): void {
    this.mascotaSel = null;
    this.mascotas = [];
    if (this.clienteSel) {
      this.citaService.mascotasPorCliente(this.clienteSel.id!).subscribe({
        next: (data) => {
          this.mascotas = data;
          this.cdr.markForCheck();
        }
      });
    }
  }

  onFechaOServicioChange(): void {
    this.trabajadorSel = null;
    this.trabajadoresDisponibles = [];
    if (!this.servicioSel || !this.fechaHora) return;

    this.cargandoTrabajadores = true;
    this.cdr.markForCheck();

    this.citaService.trabajadoresDisponibles(this.servicioSel.id!, this.fechaHora).subscribe({
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

  get formularioValido(): boolean {
    return !!(this.clienteSel && this.mascotaSel && this.servicioSel &&
              this.trabajadorSel && this.fechaHora && this.motivo.trim());
  }

  crearCita(): void {
    if (!this.formularioValido) {
      this.toast.warn('Completa todos los campos');
      return;
    }

    this.creando = true;
    this.cdr.markForCheck();

    const dto = {
      mascotaId: this.mascotaSel!.id,
      servicioId: this.servicioSel!.id!,
      trabajadorId: this.trabajadorSel!.id,
      fechaHora: this.fechaHora,
      motivo: this.motivo,
    };

    this.citaService.crearCita(dto).subscribe({
      next: () => {
        this.creando = false;
        this.displayCrear = false;
        this.toast.success('Cita creada correctamente');
        this.listarCitas();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.creando = false;
        this.toast.error(err.error?.message ?? 'Error al crear la cita');
        this.cdr.markForCheck();
      }
    });
  }

  private resetForm(): void {
    this.clienteSel = null;
    this.mascotaSel = null;
    this.servicioSel = null;
    this.trabajadorSel = null;
    this.mascotas = [];
    this.trabajadoresDisponibles = [];
    this.fechaHora = '';
    this.motivo = '';
    this.creando = false;
    this.cargandoTrabajadores = false;
  }

  // ── PAGO ────────────────────────────────────────────

  abrirPago(cita: Cita): void {
    this.citaPago = cita;
    this.metodoPagoSel = 'EFECTIVO';
    this.displayPago = true;
  }

  confirmarPago(): void {
    if (!this.citaPago) return;
    this.pagando = true;
    this.cdr.markForCheck();

    this.citaService.pagarCitaAdmin(this.citaPago.id!, this.metodoPagoSel).subscribe({
      next: (citaActualizada) => {
        const idx = this.citas.findIndex(c => c.id === this.citaPago!.id);
        if (idx >= 0) this.citas[idx] = citaActualizada;
        this.citas = [...this.citas];
        if (this.citaDetalle?.id === this.citaPago!.id) this.citaDetalle = citaActualizada;
        this.toast.success('Pago registrado correctamente');
        this.descargarBoleta(citaActualizada);
        this.displayPago = false;
        this.pagando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.pagando = false;
        this.toast.error(err.error?.message ?? 'Error al registrar pago');
        this.cdr.markForCheck();
      }
    });
  }

  descargarBoleta(cita: Cita): void {
    this.pdfService.generarBoletaCita(cita);
  }

  tienePago(cita: Cita): boolean {
    return !!(cita.pagoId && cita.pagoMetodo);
  }

  montoPago(cita: Cita): number {
    return cita.precioServicio ?? 0;
  }
}

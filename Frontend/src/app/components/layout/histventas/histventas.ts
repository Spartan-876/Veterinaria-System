import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { Venta } from '../../../models/carrito';
import { VentaService } from '../../../services/venta-service';
import { PdfService } from '../../../services/pdf-service';
import { GToast } from '../../../services/gtoast';

@Component({
  selector: 'app-histventas',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, DialogModule],
  templateUrl: './histventas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Histventas implements OnInit {
  ventas: Venta[] = [];
  ventaExpandida: number | null = null;
  cargando = true;
  terminoBusqueda = '';

  // Modal pago
  displayPago = false;
  ventaPago: Venta | null = null;
  metodoPagoSel = 'EFECTIVO';
  readonly metodosPago = ['EFECTIVO', 'TARJETA', 'YAPE', 'PLIN'];
  pagando = false;

  constructor(
    private ventaService: VentaService,
    private pdfService: PdfService,
    private toast: GToast,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.ventaService.listarTodas().subscribe({
      next: (data) => {
        Promise.resolve().then(() => {
          this.ventas = data.sort((a, b) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );
          this.cargando = false;
          this.cdr.markForCheck();
        });
      },
      error: () => { this.cargando = false; this.cdr.markForCheck(); }
    });
  }

  get ventasFiltradas(): Venta[] {
    if (!this.terminoBusqueda) return this.ventas;
    const t = this.terminoBusqueda.toLowerCase();
    return this.ventas.filter(v =>
      v.id.toString().includes(t) ||
      v.estado.toLowerCase().includes(t) ||
      (v.cliente?.nombres ?? '').toLowerCase().includes(t) ||
      (v.cliente?.apellidos ?? '').toLowerCase().includes(t)
    );
  }

  toggleDetalle(id: number): void {
    this.ventaExpandida = this.ventaExpandida === id ? null : id;
  }

  descargarBoleta(venta: Venta): void {
    this.pdfService.generarBoletaVenta(venta);
  }

  abrirPago(venta: Venta): void {
    this.ventaPago = venta;
    this.metodoPagoSel = 'EFECTIVO';
    this.displayPago = true;
  }

  confirmarPagoVenta(): void {
    if (!this.ventaPago) return;
    this.pagando = true;
    this.cdr.markForCheck();

    this.ventaService.registrarPagoVenta(this.ventaPago.id!, this.metodoPagoSel, this.ventaPago.total).subscribe({
      next: (ventaActualizada) => {
        const idx = this.ventas.findIndex(v => v.id === this.ventaPago!.id);
        if (idx >= 0) this.ventas[idx] = ventaActualizada;
        this.ventas = [...this.ventas];
        if (this.ventaExpandida === this.ventaPago!.id) this.ventaExpandida = null;
        this.toast.success('Pago registrado correctamente');
        this.descargarBoleta(ventaActualizada);
        this.displayPago = false;
        this.pagando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.pagando = false;
        const msg = typeof err.error === 'string' ? err.error : (err.error?.message ?? 'Error al registrar pago');
        this.toast.error(msg);
        this.cdr.markForCheck();
      }
    });
  }

  get totalVentas(): number {
    return this.ventas
      .filter(v => v.estado === 'COMPLETADA')
      .reduce((acc, v) => acc + v.total, 0);
  }

  get ventasHoy(): number {
    const hoy = new Date().toDateString();
    return this.ventas.filter(v =>
      new Date(v.fecha).toDateString() === hoy
    ).length;
  }
}

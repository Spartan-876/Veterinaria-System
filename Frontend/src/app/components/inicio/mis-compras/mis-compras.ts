import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../../services/venta-service';
import { Venta } from '../../../models/carrito';
import {RouterLink} from '@angular/router';
import { PdfService } from '../../../services/pdf-service';

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-compras.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisCompras implements OnInit {
  ventas: Venta[] = [];
  ventaExpandida: number | null = null;
  cargando = true;

  constructor(private ventaService: VentaService, private cdr: ChangeDetectorRef, private pdfService : PdfService) {}

  ngOnInit(): void {
    const clienteId = Number(localStorage.getItem('clienteId'));
    if (!clienteId) return;

    this.ventaService.listarPorCliente(clienteId).subscribe({
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

  toggleDetalle(id: number): void {
    this.ventaExpandida = this.ventaExpandida === id ? null : id;
  }

  get totalGastado(): number {
    return this.ventas.reduce((acc, v) => acc + v.total, 0);
  }

  descargarBoleta(venta: any): void {
    this.pdfService.generarBoletaVenta(venta);
  }
}

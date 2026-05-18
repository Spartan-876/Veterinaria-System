import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Venta } from '../../../models/carrito';
import {VentaService} from '../../../services/venta-service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './ventas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ventas implements OnInit {
  ventas: Venta[] = [];
  ventaExpandida: number | null = null;
  cargando = true;
  terminoBusqueda = '';

  constructor(private ventaService: VentaService, private cdr: ChangeDetectorRef) {}

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

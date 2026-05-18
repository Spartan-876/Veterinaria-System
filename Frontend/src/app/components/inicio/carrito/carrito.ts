// components/carrito/carrito.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService} from '../../../services/venta-service';
import { ItemCarrito } from '../../../models/carrito';
import { GToast } from '../../../services/gtoast';
import {CarritoService} from '../../../services/carrito-service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',

})
export class Carrito implements OnInit {
  abierto = false;
  items: ItemCarrito[] = [];
  procesando = false;
  ventaExitosa = false;

  constructor(
    public carritoService: CarritoService,
    private ventaService: VentaService,
    private toast: GToast,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carritoService.items$.subscribe(items => {
      this.items = items;
    });
  }

  get total(): number {
    return this.carritoService.total;
  }

  get cantidad(): number {
    return this.carritoService.cantidad;
  }

  abrir(): void { this.abierto = true; this.ventaExitosa = false; }
  cerrar(): void { this.abierto = false; }

  incrementar(id: number): void { this.carritoService.incrementar(id); }
  decrementar(id: number): void { this.carritoService.decrementar(id); }
  eliminar(id: number): void { this.carritoService.eliminar(id); }

  confirmarCompra(): void {
    if (this.items.length === 0) return;

    // Obtener clienteId desde localStorage/sessionStorage (lo guarda el login)
    const clienteId = Number(localStorage.getItem('clienteId'));
    if (!clienteId) {
      this.toast.warn('Debes iniciar sesión para comprar');
      return;
    }

    this.procesando = true;
    const dto = {
      clienteId,
      detalles: this.items.map(i => ({
        productoId: i.productoId,
        nombreProducto: i.nombreProducto,
        precioUnitario: i.precioUnitario,
        cantidad: i.cantidad,
      }))
    };

    this.ventaService.realizarVenta(dto).subscribe({
      next: () => {
        this.carritoService.limpiar();
        this.procesando = false;
        this.ventaExitosa = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.procesando = false;
        this.toast.error('Error al procesar la compra');
        this.cdr.markForCheck();
      }
    });
  }
}

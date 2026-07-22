import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Venta, VentaRequestDTO } from '../../../models/carrito';
import { Cliente } from '../../../models/cliente';
import { Producto } from '../../../models/producto';
import { VentaService } from '../../../services/venta-service';
import { PagosRegistroService } from '../../../services/pagos-registro.service';
import { ProductoService } from '../../../services/productos';
import { PdfService } from '../../../services/pdf-service';
import { GToast } from '../../../services/gtoast';

interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './ventas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ventas implements OnInit {
  cliente: Cliente | null = null;
  dniBusqueda = '';
  buscarClienteError = '';
  sinBoleta = false;

  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  cantidadProducto = 1;

  carrito: CarritoItem[] = [];
  cargando = false;
  registrando = false;

  constructor(
    private ventaService: VentaService,
    private pagosService: PagosRegistroService,
    private productoService: ProductoService,
    private pdfService: PdfService,
    private toast: GToast,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productoService.listarProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cdr.markForCheck();
      }
    });
  }

  buscarCliente(): void {
    if (!this.dniBusqueda || this.dniBusqueda.length !== 8) {
      this.buscarClienteError = 'El DNI debe tener 8 dígitos';
      return;
    }
    this.buscarClienteError = '';
    this.ventaService.buscarClientePorDni(this.dniBusqueda).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.buscarClienteError = '';
        this.cdr.markForCheck();
      },
      error: () => {
        this.cliente = null;
        this.buscarClienteError = 'Cliente no encontrado con DNI: ' + this.dniBusqueda;
        this.cdr.markForCheck();
      }
    });
  }

  activarSinBoleta(): void {
    this.sinBoleta = !this.sinBoleta;
    if (this.sinBoleta) {
      this.ventaService.buscarClientePorDni('00000000').subscribe({
        next: (cliente) => {
          this.cliente = cliente;
          this.dniBusqueda = '';
          this.buscarClienteError = '';
          this.cdr.markForCheck();
        },
        error: () => {
          this.toast.error('Error al cargar cliente genérico');
          this.sinBoleta = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.cliente = null;
    }
  }

  agregarAlCarrito(): void {
    if (!this.productoSeleccionado) return;

    const existente = this.carrito.find(c => c.producto.id === this.productoSeleccionado!.id);
    if (existente) {
      if (existente.cantidad + this.cantidadProducto > this.productoSeleccionado.stock) {
        this.toast.warn('Stock insuficiente. Disponible: ' + this.productoSeleccionado.stock);
        return;
      }
      existente.cantidad += this.cantidadProducto;
    } else {
      if (this.cantidadProducto > this.productoSeleccionado.stock) {
        this.toast.warn('Stock insuficiente. Disponible: ' + this.productoSeleccionado.stock);
        return;
      }
      this.carrito.push({ producto: this.productoSeleccionado, cantidad: this.cantidadProducto });
    }

    this.productoSeleccionado = null;
    this.cantidadProducto = 1;
    this.cdr.markForCheck();
  }

  removerDelCarrito(index: number): void {
    this.carrito.splice(index, 1);
    this.cdr.markForCheck();
  }

  incrementarCantidad(index: number): void {
    const item = this.carrito[index];
    if (item.cantidad < item.producto.stock) {
      item.cantidad++;
      this.cdr.markForCheck();
    }
  }

  decrementarCantidad(index: number): void {
    const item = this.carrito[index];
    if (item.cantidad > 1) {
      item.cantidad--;
      this.cdr.markForCheck();
    }
  }

  get totalCarrito(): number {
    return this.carrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  }

  registrarVenta(): void {
    if (!this.cliente) {
      this.toast.warn('Selecciona un cliente o activa "Venta sin boleta"');
      return;
    }
    if (this.carrito.length === 0) {
      this.toast.warn('Agrega al menos un producto');
      return;
    }

    this.registrando = true;

    const dto: VentaRequestDTO = {
      clienteId: this.cliente.id!,
      detalles: this.carrito.map(item => ({
        productoId: item.producto.id,
        nombreProducto: item.producto.nombre,
        precioUnitario: item.producto.precio,
        cantidad: item.cantidad,
      }))
    };

    this.ventaService.realizarVenta(dto).subscribe({
      next: (venta) => {
        this.toast.success('Venta registrada correctamente');
        this.carrito = [];
        this.cliente = null;
        this.dniBusqueda = '';
        this.sinBoleta = false;
        this.registrando = false;

        this.pdfService.generarBoletaVenta(venta);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.registrando = false;
        this.toast.error(err.error?.message || 'Error al registrar venta');
        this.cdr.markForCheck();
      }
    });
  }
}

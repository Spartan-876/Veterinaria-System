import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../../models/producto';
import { ProductoService } from '../../../../services/productos';
import {CarritoService} from '../../../../services/carrito-service';
import { GToast} from '../../../../services/gtoast';

@Component({
  selector: 'app-products-section',
  imports: [CommonModule],
  templateUrl: './products-section.html',
})
export class ProductsSection implements OnInit {
  productos: Producto[] = [];
  productosMostrados: Producto[] = [];

  constructor(private productosService: ProductoService, private cdr: ChangeDetectorRef, private carritoService: CarritoService, private  toast : GToast) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productosService.listarProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosMostrados = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error: ', err)
    });
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregar({
      productoId: producto.id,
      nombreProducto: producto.nombre,
      precioUnitario: producto.precio,
      cantidad: 1,
      imagenUrl: producto.imagen_url
    });
    this.toast.success(`${producto.nombre} agregado al carrito`);
  }
}

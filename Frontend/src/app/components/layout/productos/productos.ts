import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../models/producto';
import { ProductoService } from '../../../services/productos';
import { GToast} from '../../../services/gtoast';
// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, PaginatorModule],
  templateUrl: './productos.html',
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productosMostrados: Producto[] = [];

  // Filtro
  terminoBusqueda: string = '';

  // Modales
  displayEdit: boolean = false;
  displayDelete: boolean = false;
  displayNew: boolean = false;

  // Producto Seleccionado
  selectedProducto: Producto = {} as Producto;

  // Paginación
  first: number = 0;
  rows: number = 8;

  constructor(private productoService: ProductoService, private cdr: ChangeDetectorRef, private toast: GToast) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.listarProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.filtrar();
        this.cdr.detectChanges();
      }
    });
  }

  // Lógica de Búsqueda
  filtrar(): void {
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
    this.first = 0;
    this.actualizarVista();
  }

  actualizarVista(): void {
    this.productosMostrados = this.productosFiltrados.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.actualizarVista();
  }

  // Funciones de Modal
  abrirEditar(producto: Producto): void {
    this.selectedProducto = { ...producto };
    this.displayEdit = true;
  }

  confirmarEliminar(producto: Producto): void {
    this.selectedProducto = producto;
    this.displayDelete = true;
  }

  abrirNuevo(): void {
    this.selectedProducto = {} as Producto;
    this.displayNew = true;
  }

  eliminarProducto(): void {
    this.productoService.eliminarProducto(this.selectedProducto.id).subscribe(() => {
      console.log('Producto Eliminado', this.selectedProducto);
      this.toast.success("Producto Eliminada");
      setTimeout(() => {
        this.cargarProductos();
        this.displayDelete = false;
        this.cdr.detectChanges();
      }, 0);
    });
  }

  guardarCambios(): void {
    this.productoService.actualizarProducto(this.selectedProducto).subscribe({
      next: (res) => {
        console.log('Producto actualizado con éxito:', res);
        this.toast.success("Producto actualizado")
        setTimeout(() => {
          this.displayEdit = false;
          this.cargarProductos();
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => console.error("Error al guardar:", err)
    })
  }

  guardarNuevo(): void {
    this.productoService.crearProducto(this.selectedProducto).subscribe({
      next: (res) => {
        this.toast.success("Producto guardado");
        setTimeout(() => {
          this.displayNew = false;
          this.cargarProductos();
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => console.error("Error al guardar:", err)
    });
  }
}

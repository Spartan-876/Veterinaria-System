import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { Cliente } from '../../../models/cliente';
import { Mascota } from '../../../models/mascota';
import { ClienteService } from '../../../services/cliente-service';
import { MascotasService } from '../../../services/mascotas-service';
import { GToast } from '../../../services/gtoast';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [TableModule, CommonModule, FormsModule, PaginatorModule,
    ButtonModule, InputTextModule, DialogModule],
  templateUrl: './clientes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Clientes implements OnInit {

  clientes: Cliente[] = [];
  clientesMostrados: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  terminoBusqueda = '';

  displayEdit = false;
  displayNew = false;
  displayDelete = false;
  displayMascotas = false;

  selectedCliente: Cliente = this.clienteVacio();
  mascotasDelCliente: Mascota[] = [];

  first = 0;
  rows = 8;

  constructor(
    private clienteService: ClienteService,
    private mascotasService: MascotasService,
    private toast: GToast,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  private clienteVacio(): Cliente {
    return { dni: '', nombres: '', apellidos: '', direccion: '', telefono: '', correo: '' };
  }

  cargarClientes(): void {
    this.clienteService.listarClientes().subscribe({
      next: (data) => {
        Promise.resolve().then(() => {
          this.clientes = data;
          this.filtrar();
          this.cdr.markForCheck();
        });
      },
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  filtrar(): void {
    const t = this.terminoBusqueda.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(c =>
      c.nombres.toLowerCase().includes(t) ||
      c.apellidos.toLowerCase().includes(t) ||
      c.dni.includes(t) ||
      (c.correo?.toLowerCase().includes(t) ?? false)
    );
    this.first = 0;
    this.actualizarVista();
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.actualizarVista();
  }

  actualizarVista(): void {
    this.clientesMostrados = this.clientesFiltrados.slice(this.first, this.first + this.rows);
  }

  abrirNuevo(): void {
    this.selectedCliente = this.clienteVacio();
    this.displayNew = true;
  }

  abrirEditar(cliente: Cliente): void {
    this.selectedCliente = { ...cliente };
    this.displayEdit = true;
  }

  confirmarEliminar(cliente: Cliente): void {
    this.selectedCliente = { ...cliente };
    this.displayDelete = true;
  }

  verMascotas(cliente: Cliente): void {
    this.selectedCliente = { ...cliente };
    this.mascotasDelCliente = [];
    this.displayMascotas = true;
    this.mascotasService.listarPorCliente(cliente.id!).subscribe({
      next: (data) => {
        this.mascotasDelCliente = data;
        this.cdr.markForCheck();
      }
    });
  }

  guardarNuevo(): void {
    this.clienteService.crearCliente(this.selectedCliente).subscribe({
      next: () => {
        this.toast.success('Cliente registrado');
        this.displayNew = false;
        this.cargarClientes();
      },
      error: () => this.toast.error('Error al registrar cliente')
    });
  }

  guardarEdicion(): void {
    this.clienteService.actualizarCliente(this.selectedCliente.id!, this.selectedCliente).subscribe({
      next: () => {
        this.toast.success('Cliente actualizado');
        this.displayEdit = false;
        this.cargarClientes();
      },
      error: () => this.toast.error('Error al actualizar cliente')
    });
  }

  eliminar(): void {
    this.clienteService.eliminarCliente(this.selectedCliente.id!).subscribe({
      next: () => {
        this.toast.success('Cliente eliminado');
        this.displayDelete = false;
        this.cargarClientes();
      },
      error: () => this.toast.error('Error al eliminar cliente')
    });
  }
}

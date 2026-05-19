import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { Usuario, UsuarioRequest } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario-service';
import { RolService } from '../../../services/rol.service';
import { ClienteService } from '../../../services/cliente-service';
import { TrabajadorService } from '../../../services/trabajador-service';
import { GToast } from '../../../services/gtoast';
import { Cliente } from '../../../models/cliente';
import { Trabajador } from '../../../models/trabajador';
import { Rol } from '../../../models/rol';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, PaginatorModule, TableModule, MultiSelectModule, SelectModule],
  templateUrl: './usuarios.html',
  standalone: true
})
export class Usuarios implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  usuariosMostrados: Usuario[] = [];

  roles: Rol[] = [];
  clientes: Cliente[] = [];
  trabajadores: Trabajador[] = [];

  displayEdit: boolean = false;
  displayNew: boolean = false;
  displayDelete: boolean = false;

  selectedUsuario: Usuario = {} as Usuario;
  nuevoUsuario: UsuarioRequest = this.getEmptyUsuario();

  first: number = 0;
  rows: number = 8;

  estados = [
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private clienteService: ClienteService,
    private trabajadorService: TrabajadorService,
    private toast: GToast,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.listarUsuarios();
      this.cargarRoles();
      this.cargarClientes();
      this.cargarTrabajadores();
    });
  }

  getEmptyUsuario(): UsuarioRequest {
    return {
      correo: '',
      password: '',
      estado: 'ACTIVO',
      clienteId: null,
      trabajadorId: null,
      roles: []
    };
  }

  listarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data: any) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
        this.actualizarVista();
        this.cdr.detectChanges();
      },
      error: (err: any) => this.toast.error('Error al listar usuarios')
    });
  }

  cargarRoles(): void {
    this.rolService.listar().subscribe({
      next: (data: any) => {
        this.roles = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => this.toast.error('Error al cargar roles')
    });
  }

  cargarClientes(): void {
    this.clienteService.listarClientes().subscribe({
      next: (data: any) => {
        this.clientes = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {}
    });
  }

  cargarTrabajadores(): void {
    this.trabajadorService.listarTrabajadores().subscribe({
      next: (data: any) => {
        this.trabajadores = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {}
    });
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.actualizarVista();
  }

  actualizarVista(): void {
    this.usuariosMostrados = this.usuariosFiltrados.slice(this.first, this.first + this.rows);
  }

  abrirNuevo(): void {
    this.nuevoUsuario = this.getEmptyUsuario();
    this.nuevoUsuario.roles = [];
    this.displayNew = true;
  }

  abrirEditar(usuario: Usuario): void {
    this.selectedUsuario = { 
      ...usuario, 
      roles: usuario.roles || [] 
    };
    this.displayEdit = true;
  }

  abrirEliminar(usuario: Usuario): void {
    this.selectedUsuario = usuario;
    this.displayDelete = true;
  }

  guardarNuevo(): void {
    if (!this.nuevoUsuario.correo || !this.nuevoUsuario.password) {
      this.toast.warn('Ingrese correo y contraseña');
      return;
    }

    this.usuarioService.crear(this.nuevoUsuario).subscribe({
      next: () => {
        this.displayNew = false;
        this.listarUsuarios();
        this.toast.success('Usuario creado correctamente');
      },
      error: (err: any) => this.toast.error('Error al crear usuario')
    });
  }

  guardarCambios(): void {
    const request: UsuarioRequest = {
      correo: this.selectedUsuario.correo,
      password: '',
      estado: this.selectedUsuario.estado,
      clienteId: this.selectedUsuario.clienteId,
      trabajadorId: this.selectedUsuario.trabajadorId,
      roles: this.selectedUsuario.roles || []
    };

    this.usuarioService.actualizar(this.selectedUsuario.id, request).subscribe({
      next: () => {
        this.displayEdit = false;
        this.listarUsuarios();
        this.toast.success('Usuario actualizado correctamente');
      },
      error: (err: any) => this.toast.error('Error al actualizar usuario')
    });
  }

  confirmarEliminar(): void {
    this.usuarioService.eliminar(this.selectedUsuario.id).subscribe({
      next: () => {
        this.displayDelete = false;
        this.listarUsuarios();
        this.toast.success('Usuario eliminado correctamente');
      },
      error: (err: any) => this.toast.error('Error al eliminar usuario')
    });
  }

  getClienteNombre(id: number | null): string {
    if (!id) return '-';
    const cliente = this.clientes.find(c => c.id === id);
    return cliente ? `${cliente.nombres} ${cliente.apellidos}` : '-';
  }

  getTrabajadorNombre(id: number | null): string {
    if (!id) return '-';
    const trabajador = this.trabajadores.find(t => t.id === id);
    return trabajador ? `${trabajador.nombres} ${trabajador.apellidos}` : '-';
  }

  getRolesOptions(): any[] {
    return this.roles.map(r => ({ label: r.nombre, value: r.nombre }));
  }

  toggleRol(rolNombre: string): void {
    const index = this.nuevoUsuario.roles.indexOf(rolNombre);
    if (index === -1) {
      this.nuevoUsuario.roles.push(rolNombre);
    } else {
      this.nuevoUsuario.roles.splice(index, 1);
    }
  }

  toggleEditRol(rolNombre: string): void {
    if (!this.selectedUsuario.roles) {
      this.selectedUsuario.roles = [];
    }
    const index = this.selectedUsuario.roles.indexOf(rolNombre);
    if (index === -1) {
      this.selectedUsuario.roles.push(rolNombre);
    } else {
      this.selectedUsuario.roles.splice(index, 1);
    }
  }

  getUsuarioNombre(usuario: any): string {
    if (usuario.clienteId) {
      return this.getClienteNombre(usuario.clienteId);
    } else if (usuario.trabajadorId) {
      return this.getTrabajadorNombre(usuario.trabajadorId);
    }
    return 'Sin asignar';
  }

  getUsuarioTipo(usuario: any): string {
    if (usuario.clienteId) {
      return 'CLIENTE';
    } else if (usuario.trabajadorId) {
      return 'TRABAJADOR';
    }
    return 'NINGUNO';
  }
}
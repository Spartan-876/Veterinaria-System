import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
})
export class Layout implements OnInit {
  titulo: string = '';
  sidebarOpen = true;

  nombre: string = '';
  correo: string = '';
  rol: string = '';
  inicial: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.actualizarTitulo();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.actualizarTitulo();
    });
    this.correo = localStorage.getItem('correo') ?? 'Correo';
    this.rol = localStorage.getItem('rol') ?? '';
    this.nombre = localStorage.getItem('nombre') ?? this.nombre;
    this.inicial = this.correo.charAt(0).toUpperCase();
  }

  private actualizarTitulo(): void {
    let route = this.activatedRoute.root;

    while (route.firstChild) {
      route = route.firstChild;
    }
    route.data.subscribe(data => {
      this.titulo = data['title'] || 'Panel Administrativo';
      this.cdr.detectChanges();
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  get rolFormateado(): string {
    const roles: Record<string, string> = {
      'ROLE_ADMIN': 'Administrador',
      'ROLE_VET': 'Veterinario',
      'ROLE_USER': 'Usuario'
    };
    return roles[this.rol] ?? this.rol.replace('ROLE_', '');
  }
}


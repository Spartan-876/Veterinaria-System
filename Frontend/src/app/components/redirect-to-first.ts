import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermisosService } from '../services/permisos.service';

@Component({
  selector: 'app-redirect-to-first',
  standalone: true,
  template: '<p>Redireccionando...</p>'
})
export class RedirectToFirst implements OnInit {
  constructor(
    private router: Router,
    private permisosService: PermisosService
  ) {}

  ngOnInit(): void {
    const primerModulo = this.permisosService.getPrimerModulo();

    if (primerModulo) {
      const ruta = `/admin/${primerModulo.toLowerCase()}`;
      this.router.navigate([ruta]);
    } else {
      this.router.navigate(['/inicio']);
    }
  }
}
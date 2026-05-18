import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule} from '@angular/common';
import { Servicio} from '../../../../models/servicios';
import { ServiciosService} from '../../../../services/servicios';

@Component({
  selector: 'app-services-section',
  imports: [ CommonModule],
  templateUrl: './services-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesSection implements OnInit {
  servicios: Servicio[] = [];
  serviciosMostrados: Servicio[] = [];

  constructor(private servicioService: ServiciosService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.servicioService.listarActivos().subscribe({
      next: (data) => {
        this.servicios = data;
        this.serviciosMostrados = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error: ', err)
    });
  }
}

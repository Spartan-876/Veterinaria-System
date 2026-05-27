import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule} from '@angular/common';
import { Servicio} from '../../../../models/servicios';
import { ServiciosService} from '../../../../services/servicios';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-services-section',
  imports: [CommonModule, DialogModule],
  templateUrl: './services-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesSection implements OnInit {
  servicios: Servicio[] = [];
  serviciosMostrados: Servicio[] = [];
  servicioSeleccionado: Servicio | null = null;
  dialogVisible = false;

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

  verDetalle(servicio: Servicio): void {
    this.servicioSeleccionado = servicio;
    this.dialogVisible = true;
    this.cdr.markForCheck();
  }
}

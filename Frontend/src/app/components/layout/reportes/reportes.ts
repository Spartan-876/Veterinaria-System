import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardChartsService } from '../../../services/dashboard-charts.service';
import { ChartCard } from '../dashboard/chart-card/chart-card';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, ChartCard],
  templateUrl: './reportes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reportes implements OnInit {

  cargando = true;

  chartIngresosLabels: string[] = [];
  chartIngresosDatasets: { label: string; data: number[]; backgroundColor: string | string[] }[] = [];
  chartEstadoLabels: string[] = [];
  chartEstadoDatasets: { data: number[]; backgroundColor: string | string[] }[] = [];
  chartEspecieLabels: string[] = [];
  chartEspecieDatasets: { data: number[]; backgroundColor: string | string[] }[] = [];
  chartServiciosLabels: string[] = [];
  chartServiciosDatasets: { data: number[]; backgroundColor: string | string[] }[] = [];

  private loadedCount = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private chartsService: DashboardChartsService
  ) {}

  ngOnInit(): void {
    this.cargarGraficos();
  }

  private cargarGraficos(): void {
    const verde = '#2d8a6e';
    const terracota = '#c75643';
    const amarillo = '#d99e30';

    this.chartsService.obtenerIngresosMensuales().subscribe({
      next: (data) => {
        this.chartIngresosLabels = data.map(d => d.mes);
        this.chartIngresosDatasets = [
          { label: 'Citas', data: data.map(d => d.citas), backgroundColor: verde },
          { label: 'Productos', data: data.map(d => d.productos), backgroundColor: terracota }
        ];
        this.onLoaded();
      }
    });

    this.chartsService.obtenerCitasPorEstado().subscribe({
      next: (data) => {
        const colores: Record<string, string> = {
          PENDIENTE: amarillo, CONFIRMADA: '#4ade80', REALIZADA: verde, CANCELADA: '#f87171'
        };
        this.chartEstadoLabels = data.map(d => d.estado);
        this.chartEstadoDatasets = [{
          data: data.map(d => d.count),
          backgroundColor: data.map(d => colores[d.estado] ?? '#9ca3af')
        }];
        this.onLoaded();
      }
    });

    this.chartsService.obtenerMascotasPorEspecie().subscribe({
      next: (data) => {
        const paleta = [verde, terracota, amarillo, '#60a5fa', '#a78bfa'];
        this.chartEspecieLabels = data.map(d => d.especie);
        this.chartEspecieDatasets = [{
          data: data.map(d => d.count),
          backgroundColor: data.map((_, i) => paleta[i % paleta.length])
        }];
        this.onLoaded();
      }
    });

    this.chartsService.obtenerTopServicios().subscribe({
      next: (data) => {
        const gradiente = [verde, '#3a9e82', amarillo, terracota, '#e07a5f'];
        this.chartServiciosLabels = data.map(d => d.servicio);
        this.chartServiciosDatasets = [{
          data: data.map(d => d.count),
          backgroundColor: gradiente.slice(0, data.length)
        }];
        this.onLoaded();
      }
    });
  }

  private onLoaded(): void {
    this.loadedCount++;
    if (this.loadedCount >= 4) {
      this.cargando = false;
      this.cdr.markForCheck();
    }
  }
}

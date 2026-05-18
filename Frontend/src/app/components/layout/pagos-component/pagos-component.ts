// components/layout/pagos-component/pagos-component.ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagosService } from '../../../services/pagos-service';
import { PagosResumenDTO } from '../../../models/pagos';

@Component({
  selector: 'app-pagos-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagos-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagosComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  resumen: PagosResumenDTO | null = null;
  cargando = true;
  chart: any = null;

  constructor(private pagosService: PagosService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.pagosService.getResumen().subscribe({
      next: (data) => {
        Promise.resolve().then(() => {
          this.resumen = data;
          this.cargando = false;
          this.cdr.markForCheck();
          setTimeout(() => this.renderChart(), 100);
        });
      },
      error: () => { this.cargando = false; this.cdr.markForCheck(); }
    });
  }

  ngAfterViewInit(): void {}

  private renderChart(): void {
    if (!this.chartCanvas || !this.resumen) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destruir chart anterior si existe
    if (this.chart) { this.chart.destroy(); }

    const labels = this.resumen.porMes.map(m => m.mes);
    const citas   = this.resumen.porMes.map(m => m.citas);
    const prods   = this.resumen.porMes.map(m => m.productos);

    // Chart.js via CDN (ya debería estar en el proyecto o agregar al index.html)
    const Chart = (window as any).Chart;
    if (!Chart) { console.warn('Chart.js no cargado'); return; }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Citas',
            data: citas,
            backgroundColor: 'rgba(13, 114, 197, 0.8)',
            borderRadius: 6,
          },
          {
            label: 'Productos',
            data: prods,
            backgroundColor: 'rgba(13, 114, 197, 0.25)',
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { font: { size: 12 }, color: '#6b7280' }
          },
          tooltip: {
            callbacks: {
              label: (ctx: any) => ` S/ ${ctx.raw.toFixed(2)}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#9ca3af', font: { size: 11 } }
          },
          y: {
            grid: { color: '#f3f4f6' },
            ticks: {
              color: '#9ca3af',
              font: { size: 11 },
              callback: (v: any) => `S/ ${v}`
            }
          }
        }
      }
    });
  }

  get porcentajeCitas(): number {
    if (!this.resumen || this.resumen.ingresosTotales === 0) return 0;
    return Math.round((this.resumen.ingresosCitas / this.resumen.ingresosTotales) * 100);
  }

  get porcentajeProductos(): number {
    if (!this.resumen || this.resumen.ingresosTotales === 0) return 0;
    return Math.round((this.resumen.ingresosProductos / this.resumen.ingresosTotales) * 100);
  }
}

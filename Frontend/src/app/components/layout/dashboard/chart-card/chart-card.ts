import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef,
  Input, OnChanges, OnDestroy, SimpleChanges, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartCard implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() titulo = '';
  @Input() tipo: 'bar' | 'doughnut' | 'pie' | 'horizontalBar' = 'bar';
  @Input() labels: string[] = [];
  @Input() datasets: { label?: string; data: number[]; backgroundColor?: string | string[] }[] = [];
  @Input() height = 260;

  private chart: any = null;
  private ready = false;

  ngAfterViewInit(): void {
    this.ready = true;
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ready && (changes['labels'] || changes['datasets'])) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  private render(): void {
    if (!this.canvas || !this.labels.length) return;
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.destroy();

    const Chart = (window as any).Chart;
    if (!Chart) { console.warn('Chart.js no cargado'); return; }

    const isHorizontal = this.tipo === 'horizontalBar';
    const chartType = isHorizontal ? 'bar' : this.tipo;

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: this.tipo !== 'horizontalBar' && this.datasets.length > 1,
          position: 'bottom',
          labels: { font: { size: 11, family: 'Inter' }, color: '#6b7280', padding: 16, usePointStyle: true }
        }
      }
    };

    if (isHorizontal) {
      options.indexAxis = 'y';
      options.plugins.legend.display = false;
    }

    if (this.tipo === 'doughnut' || this.tipo === 'pie') {
      options.cutout = this.tipo === 'doughnut' ? '65%' : undefined;
      options.plugins.legend.position = 'bottom';
    }

    if (chartType === 'bar' && !isHorizontal) {
      options.scales = {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#9ca3af' } },
        y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, color: '#9ca3af' }, beginAtZero: true }
      };
    }

    if (isHorizontal) {
      options.scales = {
        x: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, color: '#9ca3af' }, beginAtZero: true },
        y: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#374151' } }
      };
    }

    this.chart = new Chart(ctx, {
      type: chartType,
      data: { labels: this.labels, datasets: this.datasets },
      options
    });
  }

  private destroy(): void {
    if (this.chart) { this.chart.destroy(); this.chart = null; }
  }
}

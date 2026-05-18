import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface CitaHoy {
  id: number;
  fechaHora: string;
  mascotaNombre: string;
  servicioNombre: string;
  trabajadorNombre: string;
  clienteNombre: string;
  estado: string;
}

interface DashboardData {
  citasHoy: number;
  clientesActivos: number;
  totalMascotas: number;
  ventasMes: number;
  citasDeHoy: CitaHoy[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅
})
export class Dashboard implements OnInit {

  data: DashboardData = {
    citasHoy: 0,
    clientesActivos: 0,
    totalMascotas: 0,
    ventasMes: 0,
    citasDeHoy: []
  };

  cargando = true;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.http.get<DashboardData>(`${environment.apiUrl}/api/citas/dashboard`)
      .subscribe({
        next: (data) => {
          Promise.resolve().then(() => {
            this.data = { ...data };
            this.cargando = false;
            this.cdr.markForCheck();
          });
        },
        error: (err) => {
          console.error('Error al cargar dashboard:', err);
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
  }

  getEstadoClass(estado: string): string {
    const clases: Record<string, string> = {
      'PENDIENTE':  'bg-yellow-100 text-yellow-700',
      'CONFIRMADA': 'bg-blue-100 text-blue-700',
      'REALIZADA':  'bg-green-100 text-green-700',
      'CANCELADA':  'bg-red-100 text-red-700'
    };
    return clases[estado] ?? 'bg-gray-100 text-gray-700';
  }

  formatHora(fechaHora: string): string {
    return new Date(fechaHora).toLocaleTimeString('es-PE', {
      hour: '2-digit', minute: '2-digit'
    });
  }

  get citasPorEstado(): { label: string; count: number; color: string }[] {
    const estados = ['PENDIENTE', 'CONFIRMADA', 'REALIZADA', 'CANCELADA'];
    const colores: Record<string, string> = {
      PENDIENTE:  'bg-yellow-400',
      CONFIRMADA: 'bg-blue-500',
      REALIZADA:  'bg-green-500',
      CANCELADA:  'bg-red-400',
    };
    return estados.map(e => ({
      label: e,
      count: this.data.citasDeHoy.filter(c => c.estado === e).length,
      color: colores[e]
    })).filter(e => e.count > 0);
  }

  contarEstado(estado: string): number {
    return this.data.citasDeHoy.filter(c => c.estado === estado).length;
  }
}

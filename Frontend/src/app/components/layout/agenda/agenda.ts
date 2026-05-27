import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaService, AgendaData } from '../../../services/agenda.service';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda.html'
})
export class Agenda implements OnInit {
  data: AgendaData = {
    citasHoy: [],
    citasSemana: [],
    horarioHoy: []
  };

  cargando = true;

  constructor(
    private agendaService: AgendaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarAgenda();
  }

  cargarAgenda(): void {
    this.agendaService.getMiAgenda().subscribe({
      next: (data) => {
        this.data = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatHora(hora: string): string {
    if (!hora) return '-';
    if (hora.includes(':') && !hora.includes('T')) {
      return hora.substring(0, 5);
    }
    return new Date(hora).toLocaleTimeString('es-PE', {
      hour: '2-digit', minute: '2-digit'
    });
  }

  formatFecha(fechaHora: string): string {
    return new Date(fechaHora).toLocaleDateString('es-PE', {
      weekday: 'long', day: 'numeric', month: 'short'
    });
  }

  getEstadoClass(estado: string): string {
    const clases: Record<string, string> = {
      'PENDIENTE': 'bg-yellow-100 text-yellow-700',
      'CONFIRMADA': 'bg-primary-container text-primary-dark',
      'REALIZADA': 'bg-green-100 text-green-700',
      'CANCELADA': 'bg-red-100 text-red-700'
    };
    return clases[estado] ?? 'bg-gray-100 text-gray-700';
  }

  getDiaSemana(dia: string): string {
    const dias: Record<string, string> = {
      'MONDAY': 'Lunes',
      'TUESDAY': 'Martes',
      'WEDNESDAY': 'Miércoles',
      'THURSDAY': 'Jueves',
      'FRIDAY': 'Viernes',
      'SATURDAY': 'Sábado',
      'SUNDAY': 'Domingo'
    };
    return dias[dia] || dia;
  }
}
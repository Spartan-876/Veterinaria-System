import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vacuna } from '../../../models/vacuna';
import { VacunaService } from '../../../services/vacuna';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { GToast} from '../../../services/gtoast';

@Component({
  selector: 'app-vacunas',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, PaginatorModule],
  templateUrl: './vacunas.html'
})

export class Vacunas implements OnInit {
  vacunas: Vacuna[] = [];
  vacunasFiltradas: Vacuna[] = [];
  vacunasMostradas: Vacuna[] = [];

  // Filtro
  terminoBusqueda: string = '';

  // Modales
  displayEdit: boolean = false;
  displayDelete: boolean = false;
  displayNew: boolean = false;

  // Vacuna Seleccionada
  selectedVacuna: Vacuna = {} as Vacuna;

  // Paginación
  first: number = 0;
  rows: number = 8;

  constructor(private vacunaService: VacunaService, private cdr: ChangeDetectorRef,private toast : GToast) { }

  ngOnInit(): void {
    this.cargarVacunas();
  }

  cargarVacunas(): void {
    this.vacunaService.listarVacunas().subscribe({
      next: (data) => {
        this.vacunas = data;
        this.filtrar();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error:', err)
    });
  }

  filtrar(): void {
    this.vacunasFiltradas = this.vacunas.filter(v =>
      v.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
      v.enfermedadAsociada.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
    this.first = 0;
    this.actualizarVista();
  }

  actualizarVista(): void {
    this.vacunasMostradas = this.vacunasFiltradas.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.actualizarVista();
  }

  abrirEditar(vacuna: Vacuna): void {
    this.selectedVacuna = { ...vacuna };
    this.displayEdit = true;
  }

  confirmarEliminar(vacuna: Vacuna): void {
    this.selectedVacuna = vacuna;
    this.displayDelete = true;
  }

  abrirNuevo(): void {
    this.selectedVacuna = {} as Vacuna;
    this.displayNew = true;
  }

  eliminarVacuna(): void {
    this.vacunaService.eliminarVacuna(this.selectedVacuna.id).subscribe(() => {
      console.log('Vacuna eliminada:', this.selectedVacuna);
      this.toast.success("Vacuna eliminada");
      setTimeout(() => {
        this.displayDelete = false;
        this.cargarVacunas();
        this.cdr.detectChanges();
      }, 0);
    });
  }

  guardarCambios(): void {
    this.vacunaService.actualizarVacuna(this.selectedVacuna).subscribe({
      next: (res) => {
        console.log('Vacuna actualizada con éxito:', res);
        this.toast.success("Vacuna actualizada con exito")
        setTimeout(() => {
          this.displayEdit = false;
          this.cargarVacunas();
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => console.error("Error al guardar:", err)
    });
  }

  guardarNuevo(): void {
    this.vacunaService.crearVacuna(this.selectedVacuna).subscribe(() => {
        console.log('Vacuna guardada correctamente');
        this.toast.success("Vacuna guardada correctamente ");
        setTimeout(() => {
          this.displayNew = false;
          this.cargarVacunas();
          this.cdr.detectChanges();
        }, 0);
    });
  }
}

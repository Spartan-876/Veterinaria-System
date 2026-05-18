import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { EnfermedadesService } from '../../../services/enfermedades-service';
import { Enfermedad } from '../../../models/enfermedad';
import { TableModule } from "primeng/table";
import { HttpClient } from '@angular/common/http';
import { MultiSelectModule } from 'primeng/multiselect';
import { GToast } from '../../../services/gtoast';
import {environment} from '../../../../environments/environment';

interface EspecieDTO {
  id: number;
  nombre: string;
}

interface EnfermedadDTO {
  id: number;
  nombre: string;
  descripcion: string;
  gravedad: string;
  especies: EspecieDTO[];
}


@Component({
  selector: 'app-enfermedades',
  standalone: true,
  imports: [CommonModule,MultiSelectModule  ,FormsModule, DialogModule, ButtonModule, InputTextModule, PaginatorModule, TableModule],
  templateUrl: './enfermedades.html',
})
export class Enfermedades implements OnInit {
  enfermedades: Enfermedad[] = [];
  enfermedadesFiltradas: Enfermedad[] = [];
  enfermedadesMostradas: Enfermedad[] = [];
  especies: EspecieDTO[] = [];
  selectedEspeciesIds: number[] = [];

  //filtro
  terminoBusqueda: string = '';

  //modales
  displayEdit: boolean = false;
  displayDelete: boolean = false;
  displayNew: boolean = false;

  //enfermedad seleccionada
  selectedEnfermedad: Enfermedad = {} as Enfermedad;

  //paginacion
  first: number = 0;
  rows: number = 8;

  constructor(private enfermedadesService: EnfermedadesService, private cdr: ChangeDetectorRef, private http: HttpClient, private toast : GToast) { }

  ngOnInit(): void {
    this.cargarEnfermedades();
    this.cargarEspecies();
  }


  cargarEnfermedades(): void {
    this.http.get<EnfermedadDTO[]>(`${environment.apiUrl}/api/enfermedades`)
      .subscribe({
        next: (data) => {
          setTimeout(() => {
            this.enfermedades = data;
            this.filtrar();
            this.cdr.detectChanges();
          }, 0);
        },
        error: (err) => console.error(err)
      });
  }


  filtrar(): void {
    const termino = this.terminoBusqueda.toLowerCase();
    this.enfermedadesFiltradas = this.enfermedades.filter(e => {
      const coincideNombre = e.nombre.toLowerCase().includes(termino);
      const coincideEspecie = e.especies && e.especies.some(especie =>
        especie.nombre.toLowerCase().includes(termino)
      );
      return coincideNombre || coincideEspecie;
    });

    this.first = 0;
    this.actualizarVista();
  }

  actualizarVista(): void {
    this.enfermedadesMostradas = this.enfermedadesFiltradas.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.actualizarVista();
  }

  //PARA LOS MODALES
  abrirNuevo(): void {
    this.displayNew = true;
    this.selectedEnfermedad = {} as Enfermedad;
    this.selectedEspeciesIds = [];
  }

  confirmarEliminar(enfermedad : Enfermedad): void{
    this.selectedEnfermedad = enfermedad;
    this.displayDelete = true;
  }

  abrirEditar(enfermedad: EnfermedadDTO): void {
    this.selectedEnfermedad = { ...enfermedad };
    this.selectedEspeciesIds = enfermedad.especies
      ? enfermedad.especies.map(e => e.id)
      : [];
    this.displayEdit = true;

  }

  //METHODS
  eliminarEnfermedad() : void {
    this.enfermedadesService.eliminarEnfermedad(this.selectedEnfermedad.id).subscribe(() =>{
      console.log('Enfermedad eliminada: ', this.selectedEnfermedad);
      setTimeout(()=>{
        this.displayDelete = false;
        this.cargarEnfermedades();
        this.cdr.detectChanges();
      },0);
      this.toast.success("Enfermedad eliminada");
    })
  }


  guardarNuevo(): void {
    const request = {
      nombre: this.selectedEnfermedad.nombre,
      descripcion: this.selectedEnfermedad.descripcion,
      gravedad: this.selectedEnfermedad.gravedad,
      especiesIds: this.selectedEspeciesIds
    };

    this.http.post(`${environment.apiUrl}/api/enfermedades`, request)
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.displayNew = false;
            this.selectedEspeciesIds = [];
            this.cargarEnfermedades();
            this.cdr.detectChanges();
          }, 0);
          this.toast.success('Enfermedad guardada correctamente');
        },
        error: (err) => this.toast.error(err)
      });
  }

  cargarEspecies(): void {
    this.http.get<EspecieDTO[]>(`${environment.apiUrl}/api/especies`)
      .subscribe({
        next: (data) => {
          setTimeout(() => {
            this.especies = data;
            this.cdr.detectChanges();
          }, 0);
        },
        error: (err) => console.error(err)
      });
  }

  guardarCambios(): void {
    const request = {
      nombre: this.selectedEnfermedad.nombre,
      descripcion: this.selectedEnfermedad.descripcion,
      gravedad: this.selectedEnfermedad.gravedad.toUpperCase(),
      especiesIds: this.selectedEspeciesIds
    };
    this.toast.success('Enfermedad guardada correctamente');
    this.http.put(`${environment.apiUrl}/api/enfermedades/${this.selectedEnfermedad.id}`, request)
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.displayEdit = false;
            this.cargarEnfermedades();
            this.cdr.detectChanges();
          }, 0);
        },
        error: (err) => this.toast.error(err)
      });
  }

}

import { Component } from '@angular/core';

interface Review{
  usuario: string;
  descripcion: string;
  fecha: string;
}

@Component({
  selector: 'app-reviews-section',
  imports: [],
  standalone: true,
  templateUrl: './reviews-section.html',
})
export class ReviewsSection {
  openIndex: number | null = null

  revs: Review [] = [
    {
      usuario: 'María Salas',
      descripcion: 'Le hice un corte de a mi perro y quedó bastante hermoso, lo RECOMIENDO.',
      fecha: '12/04/25'
    },
    {
      usuario: 'Eduardo Villa',
      descripcion: 'Solicité el servicio de hospedaje para mi pequeño, le gustó demasiado.',
      fecha: '12/08/25'
    },
    {
      usuario: 'Esther Vasquez',
      descripcion: 'Los doctores están muy capacitados y tratan a los animales correctamente.',
      fecha: '19/08/25'
    }
  ];
}

import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';

interface Faq {
  pregunta: string;
  respuesta: string;
}

@Component({
  selector: 'app-faqsection',
  imports: [CommonModule],
  templateUrl: './faqsection.html',
  styleUrl: './faqsection.css',
})
export class FAQSection {
  openIndex: number | null = null;

  faqs: Faq[] = [
    {
      pregunta: '¿Qué servicios veterinarios ofrecen?',
      respuesta: 'Ofrecemos consultas generales, vacunación, cirugías, odontología, grooming y urgencias las 24 horas.'
    },
    {
      pregunta: '¿Necesito cita previa?',
      respuesta: 'Para consultas programadas sí recomendamos reservar cita. Para urgencias atendemos de inmediato sin necesidad de cita.'
    },
    {
      pregunta: '¿Atienden a todo tipo de mascotas?',
      respuesta: 'Sí, atendemos perros, gatos, conejos, aves y animales exóticos. Contamos con especialistas para cada especie.'
    },
    {
      pregunta: '¿Cuáles son sus horarios de atención?',
      respuesta: 'Lunes a viernes de 8am a 8pm, sábados de 9am a 6pm y domingos de 10am a 2pm. Urgencias las 24 horas.'
    },
    {
      pregunta: '¿Tienen servicio de grooming?',
      respuesta: 'Sí, contamos con servicio de baño, corte, desparasitación externa y arreglo de uñas para tu mascota.'
    },
  ];

  toggle(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }
}

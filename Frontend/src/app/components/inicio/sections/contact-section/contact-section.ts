import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-contact-section',
  imports: [FormsModule],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.css',
})
export class ContactSection {
  form = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  };

  enviar(): void {
    if (!this.form.nombre || !this.form.email || !this.form.mensaje) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }
    console.log('Formulario enviado:', this.form);
    // Aquí conectas con tu servicio o API
    alert('¡Mensaje enviado! Nos pondremos en contacto pronto.');
    this.form = { nombre: '', email: '', asunto: '', mensaje: '' };
  }
}

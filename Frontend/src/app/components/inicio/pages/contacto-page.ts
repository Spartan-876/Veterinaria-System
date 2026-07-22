import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { ContactSection } from '../sections/contact-section/contact-section';
import { FooterComponent } from '../footer-component/footer-component';
import { Carrito } from '../carrito/carrito';

@Component({
  selector: 'app-contacto-page',
  standalone: true,
  imports: [NavbarComponent, ContactSection, FooterComponent, Carrito],
  template: `
    <app-navbar-component></app-navbar-component>
    <div class="pt-20">
      <app-contact-section></app-contact-section>
    </div>
    <app-footer></app-footer>
    <app-carrito></app-carrito>
  `
})
export class ContactoPage implements OnInit {
  ngOnInit(): void {
    document.body.classList.add('dark-scroll');
  }
}
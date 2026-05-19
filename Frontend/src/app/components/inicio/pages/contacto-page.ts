import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { ContactSection } from '../sections/contact-section/contact-section';

@Component({
  selector: 'app-contacto-page',
  standalone: true,
  imports: [NavbarComponent, ContactSection],
  template: `
    <app-navbar-component></app-navbar-component>
    <div class="pt-20">
      <app-contact-section></app-contact-section>
    </div>
  `
})
export class ContactoPage implements OnInit {
  ngOnInit(): void {
    document.body.classList.add('dark-scroll');
  }
}
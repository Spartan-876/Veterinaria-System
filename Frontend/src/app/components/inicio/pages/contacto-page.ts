import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { ContactSection } from '../sections/contact-section/contact-section';
import { FooterComponent } from '../footer-component/footer-component';

@Component({
  selector: 'app-contacto-page',
  standalone: true,
  imports: [NavbarComponent, ContactSection, FooterComponent],
  template: `
    <app-navbar-component></app-navbar-component>
    <div class="pt-20">
      <app-contact-section></app-contact-section>
    </div>
    <app-footer></app-footer>
  `
})
export class ContactoPage implements OnInit {
  ngOnInit(): void {
    document.body.classList.add('dark-scroll');
  }
}
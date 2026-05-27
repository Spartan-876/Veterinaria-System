import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { ServicesSection } from '../sections/services-section/services-section';
import { FooterComponent } from '../footer-component/footer-component';

@Component({
  selector: 'app-servicios-page',
  standalone: true,
  imports: [NavbarComponent, ServicesSection, FooterComponent],
  template: `
    <app-navbar-component></app-navbar-component>
    <div class="pt-20">
      <app-services-section></app-services-section>
    </div>
    <app-footer></app-footer>
  `
})
export class ServiciosPage implements OnInit {
  ngOnInit(): void {
    document.body.classList.add('dark-scroll');
  }
}
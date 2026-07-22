import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { AboutSection } from '../sections/about-section/about-section';
import { FooterComponent } from '../footer-component/footer-component';
import { Carrito } from '../carrito/carrito';

@Component({
  selector: 'app-sobre-nosotros-page',
  standalone: true,
  imports: [NavbarComponent, AboutSection, FooterComponent, Carrito],
  template: `
    <app-navbar-component></app-navbar-component>
    <div class="pt-20">
      <app-about-section></app-about-section>
    </div>
    <app-footer></app-footer>
    <app-carrito></app-carrito>
  `
})
export class SobreNosotrosPage implements OnInit {
  ngOnInit(): void {
    document.body.classList.add('dark-scroll');
  }
}
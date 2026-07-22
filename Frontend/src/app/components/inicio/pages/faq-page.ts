import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { FAQSection } from '../sections/faqsection/faqsection';
import { FooterComponent } from '../footer-component/footer-component';
import { Carrito } from '../carrito/carrito';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [NavbarComponent, FAQSection, FooterComponent, Carrito],
  template: `
    <app-navbar-component></app-navbar-component>
    <div class="pt-20">
      <app-faqsection></app-faqsection>
    </div>
    <app-footer></app-footer>
    <app-carrito></app-carrito>
  `
})
export class FAQPage implements OnInit {
  ngOnInit(): void {
    document.body.classList.add('dark-scroll');
  }
}
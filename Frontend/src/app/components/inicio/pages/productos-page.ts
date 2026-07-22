import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { ProductsSection } from '../sections/products-section/products-section';
import { FooterComponent } from '../footer-component/footer-component';
import { Carrito } from '../carrito/carrito';

@Component({
  selector: 'app-productos-page',
  standalone: true,
  imports: [NavbarComponent, ProductsSection, FooterComponent, Carrito],
  template: `
    <app-navbar-component></app-navbar-component>
    <div class="pt-20">
      <app-products-section></app-products-section>
    </div>
    <app-footer></app-footer>
    <app-carrito></app-carrito>
  `
})
export class ProductosPage implements OnInit {
  ngOnInit(): void {
    document.body.classList.add('dark-scroll');
  }
}
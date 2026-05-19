import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { ProductsSection } from '../sections/products-section/products-section';

@Component({
  selector: 'app-productos-page',
  standalone: true,
  imports: [NavbarComponent, ProductsSection],
  template: `
    <app-navbar-component></app-navbar-component>
    <div class="pt-20">
      <app-products-section></app-products-section>
    </div>
  `
})
export class ProductosPage implements OnInit {
  ngOnInit(): void {
    document.body.classList.add('dark-scroll');
  }
}
import {Component, OnDestroy, OnInit} from '@angular/core';
import { NavbarComponent } from './navbar-component/navbar-component';
import { HeroSection } from './hero-section/hero-section';
import { Carrito } from './carrito/carrito';
import { FooterComponent } from './footer-component/footer-component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NavbarComponent, HeroSection, Carrito, FooterComponent],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class Inicio implements OnInit , OnDestroy{

  ngOnInit(): void {
    document.body.classList.add('dark-scroll')
  }

  ngOnDestroy(): void {
    document.body.classList.remove('dark-scroll');
  }
}

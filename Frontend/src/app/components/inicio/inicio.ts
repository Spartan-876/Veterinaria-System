import {Component, OnDestroy, OnInit} from '@angular/core';
import { NavbarComponent } from './navbar-component/navbar-component';
import { HeroSection } from './hero-section/hero-section';
import {Sections} from './sections/sections';
import { Carrito} from './carrito/carrito';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NavbarComponent,HeroSection, Sections, Carrito],
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

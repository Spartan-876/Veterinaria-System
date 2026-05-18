import {Component, HostListener, OnInit} from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar-component.html',
  styleUrl : 'navbar-component.css'
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  isLoggedIn = false;
  nombre = '';
  inicial= '';
  menuPerfil= false;
  menuMobile = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.nombre = localStorage.getItem('nombre') ?? '';
      this.inicial = this.nombre.charAt(0).toUpperCase();
    }
  }

  @HostListener('window:scroll',[])
  onWindowScroll(){
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenuPerfil(): void {
    this.menuPerfil = !this.menuPerfil;
  }

  toggleMenuMobile(): void { // ← agregar
    this.menuMobile = !this.menuMobile;
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.menuPerfil = false;
    this.menuMobile = false;
  }

}

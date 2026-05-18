import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-section.html',
  styleUrls: ['./hero-section.css']
})
export class HeroSection {
  scrollOpacity = 1;
  imageScale = 1;
  textY = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scroll = window.scrollY;
    const height = window.innerHeight;

    const progress = Math.min(scroll / height, 1);

    this.imageScale = 1 + (progress * 0.2);
    this.scrollOpacity = Math.max(1 - (progress * 2), 0);
    this.textY = progress * -200;
  }
}

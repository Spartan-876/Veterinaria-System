import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { ReviewsSection } from '../sections/reviews-section/reviews-section';

@Component({
  selector: 'app-opiniones-page',
  standalone: true,
  imports: [NavbarComponent, ReviewsSection],
  template: `
    <app-navbar-component></app-navbar-component>
    <div class="pt-20">
      <app-reviews-section></app-reviews-section>
    </div>
  `
})
export class OpinionesPage implements OnInit {
  ngOnInit(): void {
    document.body.classList.add('dark-scroll');
  }
}
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar-component/navbar-component';
import { FAQSection } from '../sections/faqsection/faqsection';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [NavbarComponent, FAQSection],
  template: `
    <app-navbar-component></app-navbar-component>
    <div class="pt-20">
      <app-faqsection></app-faqsection>
    </div>
  `
})
export class FAQPage implements OnInit {
  ngOnInit(): void {
    document.body.classList.add('dark-scroll');
  }
}
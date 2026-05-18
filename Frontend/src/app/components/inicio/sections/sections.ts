import { Component } from '@angular/core';
import { AboutSection } from './about-section/about-section';
import { ServicesSection } from './services-section/services-section';
import { ProductsSection } from './products-section/products-section';
import { FAQSection } from './faqsection/faqsection';
import { ContactSection } from './contact-section/contact-section';
import { ReviewsSection } from './reviews-section/reviews-section';


@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [AboutSection, ServicesSection, ProductsSection, FAQSection, ContactSection,ReviewsSection],
  templateUrl: './sections.html',
})
export class Sections {

}

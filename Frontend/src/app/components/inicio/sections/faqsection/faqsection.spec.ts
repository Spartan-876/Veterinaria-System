import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQSection } from './faqsection';

describe('FAQSection', () => {
  let component: FAQSection;
  let fixture: ComponentFixture<FAQSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FAQSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FAQSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

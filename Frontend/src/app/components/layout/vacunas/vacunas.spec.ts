import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vacunas } from './vacunas';

describe('Vacunas', () => {
  let component: Vacunas;
  let fixture: ComponentFixture<Vacunas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vacunas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vacunas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

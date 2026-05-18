import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Enfermedades } from './enfermedades';

describe('Enfermedades', () => {
  let component: Enfermedades;
  let fixture: ComponentFixture<Enfermedades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Enfermedades]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Enfermedades);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

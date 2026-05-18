import { TestBed } from '@angular/core/testing';

import { GToast } from './gtoast';

describe('GToast', () => {
  let service: GToast;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GToast);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

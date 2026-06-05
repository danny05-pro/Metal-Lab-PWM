import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DipendenteGuard } from './dipendente-guard';

describe('DipendenteGuard', () => {
  let guard: DipendenteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
    guard = TestBed.inject(DipendenteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

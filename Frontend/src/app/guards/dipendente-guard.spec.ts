import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { dipendenteGuard } from './dipendente-guard';

describe('dipendenteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => dipendenteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

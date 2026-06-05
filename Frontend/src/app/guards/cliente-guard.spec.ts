import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ClienteGuard } from './cliente-guard';

describe('ClienteGuard', () => {
  let guard: ClienteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
    guard = TestBed.inject(ClienteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

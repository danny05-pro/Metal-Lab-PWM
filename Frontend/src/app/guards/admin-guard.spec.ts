import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdminGuard } from './admin-guard';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
    guard = TestBed.inject(AdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

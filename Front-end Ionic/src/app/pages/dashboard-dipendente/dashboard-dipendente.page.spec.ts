import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardDipendentePage } from './dashboard-dipendente.page';

describe('DashboardDipendentePage', () => {
  let component: DashboardDipendentePage;
  let fixture: ComponentFixture<DashboardDipendentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDipendentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

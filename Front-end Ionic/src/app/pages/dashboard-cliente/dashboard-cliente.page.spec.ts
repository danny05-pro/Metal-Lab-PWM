import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardClientePage } from './dashboard-cliente.page';

describe('DashboardClientePage', () => {
  let component: DashboardClientePage;
  let fixture: ComponentFixture<DashboardClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

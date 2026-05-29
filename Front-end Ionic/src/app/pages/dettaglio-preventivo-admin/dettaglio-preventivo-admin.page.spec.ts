import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DettaglioPreventivoPage } from './dettaglio-preventivo-admin.page';

describe('DettaglioPreventivoPage', () => {
  let component: DettaglioPreventivoPage;
  let fixture: ComponentFixture<DettaglioPreventivoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioPreventivoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

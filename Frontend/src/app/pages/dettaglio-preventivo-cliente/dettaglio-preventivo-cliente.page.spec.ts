import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DettaglioPreventivoClientePage } from './dettaglio-preventivo-cliente.page';

describe('DettaglioPreventivoClientePage', () => {
  let component: DettaglioPreventivoClientePage;
  let fixture: ComponentFixture<DettaglioPreventivoClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioPreventivoClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

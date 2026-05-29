import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestioneDipendentiPage } from './gestione-dipendenti.page';

describe('GestioneDipendentiPage', () => {
  let component: GestioneDipendentiPage;
  let fixture: ComponentFixture<GestioneDipendentiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestioneDipendentiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

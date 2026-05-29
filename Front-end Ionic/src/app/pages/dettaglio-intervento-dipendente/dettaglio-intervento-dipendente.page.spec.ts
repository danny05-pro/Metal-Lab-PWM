import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DettaglioInterventoDipendentePage } from './dettaglio-intervento-dipendente.page';

describe('DettaglioInterventoDipendentePage', () => {
  let component: DettaglioInterventoDipendentePage;
  let fixture: ComponentFixture<DettaglioInterventoDipendentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioInterventoDipendentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

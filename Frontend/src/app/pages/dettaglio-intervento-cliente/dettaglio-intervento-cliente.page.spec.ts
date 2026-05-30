import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DettaglioInterventoClientePage } from './dettaglio-intervento-cliente.page';

describe('DettaglioInterventoClientePage', () => {
  let component: DettaglioInterventoClientePage;
  let fixture: ComponentFixture<DettaglioInterventoClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioInterventoClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DettaglioInterventoAdminPage } from './dettaglio-intervento-admin.page';

describe('DettaglioInterventoAdminPage', () => {
  let component: DettaglioInterventoAdminPage;
  let fixture: ComponentFixture<DettaglioInterventoAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioInterventoAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

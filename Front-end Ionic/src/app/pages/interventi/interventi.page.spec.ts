import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterventiPage } from './interventi.page';

describe('InterventiPage', () => {
  let component: InterventiPage;
  let fixture: ComponentFixture<InterventiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

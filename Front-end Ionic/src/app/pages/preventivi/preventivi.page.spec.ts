import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreventiviPage } from './preventivi.page';

describe('PreventiviPage', () => {
  let component: PreventiviPage;
  let fixture: ComponentFixture<PreventiviPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventiviPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowSaleComponent } from './window-sale.component';

describe('WindowSaleComponent', () => {
  let component: WindowSaleComponent;
  let fixture: ComponentFixture<WindowSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

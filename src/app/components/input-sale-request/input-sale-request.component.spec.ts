import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSaleRequestComponent } from './input-sale-request.component';

describe('InputSaleRequestComponent', () => {
  let component: InputSaleRequestComponent;
  let fixture: ComponentFixture<InputSaleRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputSaleRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSaleRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

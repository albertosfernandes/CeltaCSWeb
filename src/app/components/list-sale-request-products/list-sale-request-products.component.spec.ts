import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSaleRequestProductsComponent } from './list-sale-request-products.component';

describe('ListSaleRequestProductsComponent', () => {
  let component: ListSaleRequestProductsComponent;
  let fixture: ComponentFixture<ListSaleRequestProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSaleRequestProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSaleRequestProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

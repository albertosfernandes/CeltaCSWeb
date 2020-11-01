import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSaleRequestComponent } from './list-sale-request.component';

describe('ListSaleRequestComponent', () => {
  let component: ListSaleRequestComponent;
  let fixture: ComponentFixture<ListSaleRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSaleRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSaleRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

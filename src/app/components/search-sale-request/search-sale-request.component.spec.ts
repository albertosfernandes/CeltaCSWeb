import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSaleRequestComponent } from './search-sale-request.component';

describe('SearchSaleRequestComponent', () => {
  let component: SearchSaleRequestComponent;
  let fixture: ComponentFixture<SearchSaleRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSaleRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSaleRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

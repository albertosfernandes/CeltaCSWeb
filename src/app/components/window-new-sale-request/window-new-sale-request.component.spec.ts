import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowNewSaleRequestComponent } from './window-new-sale-request.component';

describe('WindowNewSaleRequestComponent', () => {
  let component: WindowNewSaleRequestComponent;
  let fixture: ComponentFixture<WindowNewSaleRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowNewSaleRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowNewSaleRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

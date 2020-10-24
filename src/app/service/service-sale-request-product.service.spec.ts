import { TestBed, inject } from '@angular/core/testing';

import { ServiceSaleRequestProductService } from './service-sale-request-product.service';

describe('ServiceSaleRequestProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceSaleRequestProductService]
    });
  });

  it('should be created', inject([ServiceSaleRequestProductService], (service: ServiceSaleRequestProductService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { ServiceSaleRequestService } from './service-sale-request.service';

describe('ServiceSaleRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceSaleRequestService]
    });
  });

  it('should be created', inject([ServiceSaleRequestService], (service: ServiceSaleRequestService) => {
    expect(service).toBeTruthy();
  }));
});

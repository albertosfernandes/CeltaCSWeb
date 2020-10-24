import { TestBed, inject } from '@angular/core/testing';

import { ServiceProductService } from './service-product.service';

describe('ServiceProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceProductService]
    });
  });

  it('should be created', inject([ServiceProductService], (service: ServiceProductService) => {
    expect(service).toBeTruthy();
  }));
});

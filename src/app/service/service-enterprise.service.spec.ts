import { TestBed, inject } from '@angular/core/testing';

import { ServiceEnterpriseService } from './service-enterprise.service';

describe('ServiceEnterpriseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceEnterpriseService]
    });
  });

  it('should be created', inject([ServiceEnterpriseService], (service: ServiceEnterpriseService) => {
    expect(service).toBeTruthy();
  }));
});

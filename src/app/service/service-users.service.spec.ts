import { TestBed, inject } from '@angular/core/testing';

import { ServiceUsersService } from './service-users.service';

describe('ServiceUsersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceUsersService]
    });
  });

  it('should be created', inject([ServiceUsersService], (service: ServiceUsersService) => {
    expect(service).toBeTruthy();
  }));
});

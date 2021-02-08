import { TestBed, inject } from '@angular/core/testing';

import { TicketsCommandsService } from './tickets-commands.service';

describe('TicketsCommandsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TicketsCommandsService]
    });
  });

  it('should be created', inject([TicketsCommandsService], (service: TicketsCommandsService) => {
    expect(service).toBeTruthy();
  }));
});

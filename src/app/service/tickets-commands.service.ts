import { ModelTicketSaleRequest } from './../model/model-ticket-saleRequest';
import { ModelTicket } from './../model/model-ticket';
import { ServiceBaseService } from './service-base.service';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketsCommandsService {

  constructor(private base: ServiceBaseService) { }

  get(ticketsStatus: number) {
    return this.base.httpBase
    .get<ModelTicketSaleRequest[]>(this.base.urlapi + '/api/APITicketAC/GetAll?tktStatus=' + ticketsStatus)
    .pipe(
      tap(
        data => console.log(data),
        err => console.log(err)
      )
    );
  }
}

import { ModelTicketSaleRequest } from './../../model/model-ticket-saleRequest';
import { Subscription } from 'rxjs';
import { TicketsCommandsService } from './../../service/tickets-commands.service';
import { ModelTicket } from './../../model/model-ticket';
import { Component, OnChanges, OnInit, OnDestroy, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-search-sale-request',
  templateUrl: './search-sale-request.component.html',
  styleUrls: ['./search-sale-request.component.css']
})
export class SearchSaleRequestComponent implements OnInit, OnChanges, OnDestroy {

  constructor(private ticketService: TicketsCommandsService) { }

  ticketsSaleRequest: ModelTicketSaleRequest[] = [];
  ticketsBlockedSaleRequest: ModelTicketSaleRequest[] = [];
  sub: Subscription[] = [];
  isShowSaleReqFull = false;
  saleRequestpersonalizedCode;
  ticketNumberSelected;
  isShowBlocked = false;
  isShowOpen = true;
  isShowAll = false;



  //#region Events
  selectIsOpen(selectedValue) {
    this.isShowOpen = !this.isShowOpen;
    if (this.isShowOpen && this.isShowBlocked) {
      this.isShowAll = true;
    }
    console.log('clicado open: ' + selectedValue);
    this.filterSearchs();
  }

  selectIsBlock(selectedValue) {
    this.isShowBlocked = !this.isShowBlocked;
    if (this.isShowOpen && this.isShowBlocked) {
      this.isShowAll = true;
    }
    console.log('clicado block: ' + selectedValue);
    this.filterSearchs();
  }
  //#endregion

//#region Methods Tickets
loadTicketsOpen() {
  this.sub.push(
    this.ticketService.get(0)
    .subscribe(resp => {
      this.ticketsSaleRequest = resp;
    },
    err => {

    },
    () => {
      // this.isShowBlocked = false;
      // this.isShowOpen = true;
    })
  );
}

loadTicketsClose() {
  this.sub.push(
    this.ticketService.get(1)
    .subscribe(resp => {
      this.ticketsBlockedSaleRequest = resp;
    },
    err => {

    },
    () => {
      // this.isShowBlocked = true;
      // this.isShowOpen = false;
    })
  );
}

getAll() {
  this.loadTicketsOpen();
  this.loadTicketsClose();
  this.isShowBlocked = true;
  this.isShowOpen = true;
}

// loadAll() {
//   this.sub.push(
//     this.ticketService.get(2)
//     .subscribe(resp => {
//       this.ticketsSaleRequest = resp;
//     },
//     err => {

//     },
//     () => {
//       this.isShowBlocked = true;
//       this.isShowOpen = true;
//     })
//   );
// }

cleanAll() {
  this.ticketsSaleRequest = [];
  this.ticketsBlockedSaleRequest = [];
  this.saleRequestpersonalizedCode = 0;
  this.isShowSaleReqFull = false;
}

loadSaleRequest(ticketNumberValue) {
  this.saleRequestpersonalizedCode = ticketNumberValue;
  this.ticketNumberSelected = ticketNumberValue;
  this.isShowSaleReqFull = true;
}

filterSearchs() {
  if (this.isShowOpen && !this.isShowBlocked) {
    // padrão exibir somente abertas
    console.log('Mostra somente as abertas');
    this.loadTicketsOpen();
  } else {
    if (!this.isShowOpen && this.isShowBlocked) {
      // exibir somente bloqueadas
      console.log('Mostra somente as bloqueadas');
      this.loadTicketsClose();
    } else {
      if (this.isShowOpen && this.isShowBlocked) {
        console.log('Mostra todas');
        this.getAll();
        // exibir tudo!!!
      } else {
        this.cleanAll();
      }
    }
  }
}
typeOfSearch() {

}
//#endregion


  ngOnInit() {
    this.loadTicketsOpen();
  }
  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe);
    this.saleRequestpersonalizedCode = 0;
    this.isShowSaleReqFull = false;
  }
  ngOnChanges(): void {
    this.filterSearchs();
    this.cleanAll();
  }
}

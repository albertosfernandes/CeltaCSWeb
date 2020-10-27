import { ServiceSaleRequestService } from './../../service/service-sale-request.service';
import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { ModelSaleRequest } from 'src/app/model/model-saleRequest';
import { ModelSaleRequestTemp } from 'src/app/model/model-saleRequestTemp';


@Component({
  selector: 'app-input-sale-request',
  templateUrl: './input-sale-request.component.html',
  styleUrls: ['./input-sale-request.component.css']
})
export class InputSaleRequestComponent implements OnInit, OnChanges, OnDestroy {

  debounce: Subject<string> = new Subject<string>();
  sub: Subscription[] = [];
  saleRequest: ModelSaleRequest;
  saleRequestTemp: ModelSaleRequestTemp;
  @Output() novo = new EventEmitter();
  personalizedCode = 'okk';
  isNew = false;

  constructor(private serviceSaleRequest: ServiceSaleRequestService) { }

  enableInputValue() {
    this.debounce
    .pipe(debounceTime(300))
    .subscribe(filter => {
      this.personalizedCode = filter; console.log('tem algo? ' + filter);
      this.getSaleRequest();
    },
    erro => {
      console.error(erro.error);
      alert(erro.error);
    },
    () => {

    } );
  }

  getSaleRequest() {
    console.log('chamei get sale Request');
    this.sub.push(
      this.serviceSaleRequest.getSaleRequest(2, this.personalizedCode)
    .subscribe(saleRequest => {
      this.saleRequest = saleRequest;
    }, erro => {
      alert(erro.error);
    },
    () => {
      // finalizou
      if (this.saleRequest == null) {
        this.isNew = true;
        this.novo.emit(this.isNew);
      }
    })
    );
  }

  ngOnInit() {
    this.enableInputValue();
  }
  ngOnChanges() {
  }
  ngOnDestroy() {
    this.debounce.unsubscribe();
    this.sub.forEach(s => s.unsubscribe);
  }
}

import { Subscription } from 'rxjs';
import { ServiceSaleRequestService } from 'src/app/service/service-sale-request.service';
import { ServiceBaseService } from 'src/app/service/service-base.service';
import { ModelSaleRequest } from 'src/app/model/model-saleRequest';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-list-sale-request',
  templateUrl: './list-sale-request.component.html',
  styleUrls: ['./list-sale-request.component.css']
})
export class ListSaleRequestComponent implements OnInit, OnChanges, OnDestroy {

  constructor(private base: ServiceBaseService, private serviceSaleRequest: ServiceSaleRequestService) { }

  @Input() saleRequestPersonalizedCode = 0;
  isShow = false;
  saleRequest = new ModelSaleRequest;
  sub: Subscription[] = [];

  validateShow() {
    if (this.saleRequestPersonalizedCode > 0) {
      this.isShow = true;
      console.log('mostra ' + this.isShow);
      this.loadSaleRequest(this.saleRequestPersonalizedCode);
    }
  }

  loadSaleRequest(_personalizedCode) {
    this.sub.push(
      this.serviceSaleRequest.getSaleRequest(this.base.enterpriseId, _personalizedCode)
      .subscribe(respSaleRequ => {
        this.saleRequest = respSaleRequ;
        console.log('valor ' + this.saleRequest);
      },
      error => {
        alert('Falha ao puxar pedido');
      },
      () => {
        // fim
      })
    );
  }

  ngOnInit() {
    console.log('inicio list ');
    this.validateShow();
  }
  ngOnDestroy() {
    this.sub.forEach(s => {
      s.unsubscribe();
    });
  }
  ngOnChanges() {
    this.validateShow();
  }

}

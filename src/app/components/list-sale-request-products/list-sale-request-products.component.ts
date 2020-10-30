import { ServiceSaleRequestService } from './../../service/service-sale-request.service';
import { Subscription } from 'rxjs';
import { ServiceSaleRequestProductService } from './../../service/service-sale-request-product.service';
import { ModelSaleRequestProductTemp } from './../../model/model-saleRequestProductTemp';
import { ModelProduct } from './../../model/model-product';
import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ModelSaleRequestTemp } from 'src/app/model/model-saleRequestTemp';
import { ServiceBaseService } from 'src/app/service/service-base.service';

@Component({
  selector: 'app-list-sale-request-products',
  templateUrl: './list-sale-request-products.component.html',
  styleUrls: ['./list-sale-request-products.component.css']
})
export class ListSaleRequestProductsComponent implements OnInit, OnChanges, OnDestroy {

  // @Input() _productReceived: ModelProduct;
  @Input() _saleRequestFull: ModelSaleRequestTemp;
  products: ModelProduct[] = [];
  @Input() isCancel = false;
  sub: Subscription[] = [];

  constructor(private serviceSaleRequestProduct: ServiceSaleRequestProductService,
              private serviceSaleRequest: ServiceSaleRequestService, private base: ServiceBaseService
              ) { }

  sendCancelItem(idSaleRequestProductTemp) {
    console.log('chamei exluir');
    this.sub.push(
      this.serviceSaleRequestProduct.deleteSaleRequestProductTemp(idSaleRequestProductTemp)
      .subscribe(resp => {
        console.log('exlcuido');
      },
      error => {
        alert('Erro ao excluir item');
      },
      () => {
        this.isCancel = false;
      }
      )
    );
  }

  reloadSaleRequest() {
    this.sub.push(
      this.serviceSaleRequest.getSaleRequestTemp(this.base.enterpriseId, this._saleRequestFull.SaleRequestTempId)
      .subscribe(saleReqValue => {
        this._saleRequestFull = saleReqValue;
      },
      error => {
        alert('Erro ao atualizar o pedido');
      },
      () => {
        // fim
      })
    );
  }

  ngOnInit() {
  }

  ngOnChanges() {

  }
  ngOnDestroy() {
    this._saleRequestFull.Products = [];
  }

}

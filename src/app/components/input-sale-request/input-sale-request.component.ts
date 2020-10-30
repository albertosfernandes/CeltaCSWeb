import { ModelSaleRequestProductTemp } from './../../model/model-saleRequestProductTemp';
import { ModelProduct } from './../../model/model-product';
import { ServiceSaleRequestProductService } from './../../service/service-sale-request-product.service';
import { ServiceBaseService } from './../../service/service-base.service';
import { ServiceSaleRequestService } from './../../service/service-sale-request.service';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
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
  saleRequestProductTemp = new ModelSaleRequestProductTemp;
  saleRequestTemp: ModelSaleRequestTemp;
  saleRequestTempNew = new  ModelSaleRequestTemp;
  @Output() novo = new EventEmitter();
  @Output() newTemp = new EventEmitter();
  @Output() currentTemp = new EventEmitter();
  @Output() saleRequestTempEmit = new EventEmitter();
  @Input() _productReceived;
  personalizedCode = 'ok';
  isNew = false;
  isNewTemp = false;
  isUsingsaleRequestTemp = false;
  @Input() _qtdInput: number;

  constructor(private serviceSaleRequest: ServiceSaleRequestService, private base: ServiceBaseService,
              private serviceSaleRequestProduct: ServiceSaleRequestProductService) { }

  enableInputValue() {
    this.debounce
    // .pipe(debounceTime(300))
    .pipe()
    .subscribe(filter => {
      this.personalizedCode = filter;
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
    this.sub.push(
      this.serviceSaleRequest.getSaleRequest(this.base.enterpriseId, this.personalizedCode)
    .subscribe(saleRequest => {
      this.saleRequest = saleRequest;
    }, erro => {
      alert(erro.error);
    },
    () => {
      // finalizou
      if (this.saleRequest == null || this.saleRequest === undefined) {
        // entao vms ver se existe saleRequestTemp!
        this.getSaleRequestTemp();
      } else {
        // carrega ele então
      }
    })
    );
  }

  getSaleRequestTemp() {
    this.sub.push(
      this.serviceSaleRequest.getSaleRequestTemp(this.base.enterpriseId, this.personalizedCode)
      .subscribe(saleRequestTempData => {
        this.saleRequestTemp = saleRequestTempData;
      },
      erro => {
        alert(erro.error);
      },
      () => {
        if (this.saleRequestTemp == null || this.saleRequestTemp === undefined) {
              this.isNewTemp = true;
              this.newTemp.emit(this.isNew);
              // vms criar uma nova Temp então
              console.log('valor de personalizedCode: ' + this.personalizedCode);
              if (this.personalizedCode !== 'ok') {
                this.addSaleRequestTemp();
              }
        } else {
          // carrega ele então
          this.saleRequestTempEmit.emit(this.saleRequestTemp);
          this.isUsingsaleRequestTemp = true;
        }
      })
    );
  }

  addSaleRequestTemp() {
    this.saleRequestTempNew.EnterpriseId = this.base.enterpriseId;
    this.saleRequestTempNew.PersonalizedCode = this.personalizedCode;
    this.sub.push(
      this.serviceSaleRequest.addSaleRequestTemp(this.saleRequestTempNew)
      .subscribe(responseAdd => {
        // deu certo?
      },
      erro => {
        alert(erro.error);
      },
      () => {
        // this.currentTemp.emit(this.personalizedCode);
        // fim - salvo
      })
    );
  }

  addSaleRequestProductTemp(_saleRequestProductTemp: ModelSaleRequestProductTemp) {
    this.sub.push(
      this.serviceSaleRequestProduct.addSaleRequestProductTemp(_saleRequestProductTemp)
      .subscribe(response => {
       // s
      },
      error => {
        alert('Falha ao adicionar novo produto ao pedido Temporário');
      },
      () => {
        // fim
      })
    );
  }

  updateSaleRequestTempProduct(_product: ModelProduct) {
    this.saleRequestProductTemp.ProductPriceLookUpCode = _product.PriceLookupCode;
    if (this._qtdInput === undefined) {
      this._qtdInput = 1;
    }
    this.saleRequestProductTemp.Quantity = this._qtdInput;
    this.saleRequestProductTemp.SaleRequestTempId = this.saleRequestTemp.SaleRequestTempId;
    this.saleRequestProductTemp.TotalLiquid = (this._qtdInput * _product.SaleRetailPrice);
    this.saleRequestProductTemp.Value = _product.SaleRetailPrice;
    // this.saleRequestProductTemp.Product = _product;
    this.updateSaleRequestTemp(this.saleRequestProductTemp);
  }

  updateSaleRequestTemp(_saleRequestProductTemp: ModelSaleRequestProductTemp) {
    this.saleRequestTemp.Products.push(_saleRequestProductTemp);
    this.saleRequestTemp.TotalLiquid = (this.saleRequestTemp.TotalLiquid + _saleRequestProductTemp.TotalLiquid);
    this.submitUpdateSaleRequestTemp(this.saleRequestTemp);
  }

  submitUpdateSaleRequestTemp (_saleRequestTempFull: ModelSaleRequestTemp) {
    this.sub.push(
      this.serviceSaleRequest.updateSaleRequestTemp(_saleRequestTempFull)
      .subscribe(response => {
        console.log('parece que atualizou!!');
      },
      error => {
        alert('Erro ao atualizar valor total do pedido');
      },
      () => {
        // fim
        this.saleRequestTemp.Products = [];
      })
    );
  }

  ngOnInit() {
    this.enableInputValue();
  }
  ngOnChanges() {
    if (this._productReceived !== undefined) {
      this.updateSaleRequestTempProduct(this._productReceived);
    }
  }
  ngOnDestroy() {
    this.debounce.unsubscribe();
    this.sub.forEach(s => s.unsubscribe);
    this.isUsingsaleRequestTemp = false;
  }
}

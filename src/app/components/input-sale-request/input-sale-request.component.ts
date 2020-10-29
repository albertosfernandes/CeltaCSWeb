import { ServiceSaleRequestProductService } from './../../service/service-sale-request-product.service';
import { ServiceBaseService } from './../../service/service-base.service';
import { ServiceSaleRequestService } from './../../service/service-sale-request.service';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { ModelSaleRequest } from 'src/app/model/model-saleRequest';
import { ModelSaleRequestTemp } from 'src/app/model/model-saleRequestTemp';
import { ModelProduct } from 'src/app/model/model-product';
import { ModelSaleRequestProductTemp } from 'src/app/model/model-saleRequestProductTemp';


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
  personalizedCode = 'okk';
  isNew = false;
  isNewTemp = false;
  @Input() _qtdInput: number;

  constructor(private serviceSaleRequest: ServiceSaleRequestService, private base: ServiceBaseService) { }

  enableInputValue() {
    this.debounce
    // .pipe(debounceTime(300))
    .pipe()
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
      this.serviceSaleRequest.getSaleRequest(this.base.enterpriseId, this.personalizedCode)
    .subscribe(saleRequest => {
      this.saleRequest = saleRequest;
    }, erro => {
      alert(erro.error);
    },
    () => {
      // finalizou
      if (this.saleRequest == null || this.saleRequest === undefined) {
        // this.isNew = true;
        // this.novo.emit(this.isNew);
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
          this.addSaleRequestTemp();
        } else {
          // carrega ele então
          this.saleRequestTempEmit.emit(this.saleRequestTemp);
          console.log(this.saleRequestTemp);
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
        this.currentTemp.emit(this.personalizedCode);
        // fim - salvo
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
    console.log(this.saleRequestProductTemp);
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
        alert('Erro ao atualizar os produtos do pedido');
      },
      () => {
        // fim
      })
    );
  }

  ngOnInit() {
    this.enableInputValue();
  }
  ngOnChanges() {
    console.log('mudou, atualize o saleRequestTemp com: ' + this._productReceived.NameReduced);
    this.updateSaleRequestTempProduct(this._productReceived);
  }
  ngOnDestroy() {
    this.debounce.unsubscribe();
    this.sub.forEach(s => s.unsubscribe);
  }
}

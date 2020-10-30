import { ModelSaleRequestProduct } from './../../model/model-saleRequestProduct';
import { ModelSaleRequestTemp } from './../../model/model-saleRequestTemp';
import { ModelProduct } from './../../model/model-product';
import { ModelSaleRequestProductTemp } from 'src/app/model/model-saleRequestProductTemp';
import { ServiceBaseService } from './../../service/service-base.service';
import { ServiceProductService } from './../../service/service-product.service';
import { ServiceSaleRequestProductService } from './../../service/service-sale-request-product.service';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ServiceSaleRequestService } from 'src/app/service/service-sale-request.service';
import { ModelSaleRequest } from 'src/app/model/model-saleRequest';

@Component({
  selector: 'app-window-sale',
  templateUrl: './window-sale.component.html',
  styleUrls: ['./window-sale.component.css']
})
export class WindowSaleComponent implements OnInit, OnChanges, OnDestroy {

  debounce: Subject<string> = new Subject<string>();
  sub: Subscription[] = [];
  isUsingsaleRequestTemp = false;
  isSaleRequestTemp = false;
  isSaleRequest = false;
  isSaleRequestActiv = false;
  isCancel = false;
  @ViewChild('product') inputProduct;
  @ViewChild('saleRequest') inputSaleRequest;
  _qtdInput = 1;

  saleRequestpersonalizedCode: any;
  saleRequestTemp = new ModelSaleRequestTemp;
  saleRequest: ModelSaleRequest;
  saleRequestNew = new ModelSaleRequest;
  saleRequestProductTemp = new ModelSaleRequestProductTemp;
  saleRequestProducts: ModelSaleRequestProduct[] = [];
  saleRequestProduct = new ModelSaleRequestProduct;
  product = new ModelProduct;


  constructor(private serviceSaleRequestProduct: ServiceSaleRequestProductService, private serviceProduct: ServiceProductService,
              private serviceSaleRequest: ServiceSaleRequestService, private base: ServiceBaseService,
              private serviceProductService: ServiceProductService) { }

  onclickSaleRequest(saleRequestValue) {
    this.saleRequestpersonalizedCode = saleRequestValue;
    this.getSaleRequest();
  }

  getSaleRequest() {
    this.sub.push(
      this.serviceSaleRequest.getSaleRequest(this.base.enterpriseId, this.saleRequestpersonalizedCode)
    .subscribe(saleRequest => {
      this.saleRequest = saleRequest;
    }, erro => {
      alert('Erro ao puxar os pedidos.');
    },
    () => {
      // finalizou
      if (this.saleRequest === null || this.saleRequest === undefined) {
        // entao vms ver se existe saleRequestTemp!
        this.getSaleRequestTemp();
      } else {
        // carrega ele então
        this.isSaleRequestActiv = true;
        this.isSaleRequest = true;
      }
    })
    );
  }

  getSaleRequestTemp() {
    this.sub.push(
      this.serviceSaleRequest.getSaleRequestTemp(this.base.enterpriseId, this.saleRequestpersonalizedCode)
      .subscribe(saleRequestTempData => {
        this.saleRequestTemp = saleRequestTempData;
      },
      erro => {
        alert('Erro ao carregar pedidos temporários');
      },
      () => {
        if (this.saleRequestTemp == null || this.saleRequestTemp === undefined) {
              // vms criar uma nova Temp então
              this.addSaleRequestTemp();
        } else {
          // carrega ele então
          this.isSaleRequestActiv = true;
          this.isSaleRequestTemp = true;
        }
      })
    );
  }

  addSaleRequestTemp() {
    this.saleRequestTemp.EnterpriseId = this.base.enterpriseId;
    this.saleRequestTemp.PersonalizedCode = this.saleRequestpersonalizedCode;
    this.sub.push(
      this.serviceSaleRequest.addSaleRequestTemp(this.saleRequestTemp)
      .subscribe(responseAdd => {
        // deu certo?
      },
      erro => {
        alert(erro.error);
      },
      () => {
        // fim - salvo - recarrega lista de pedidos pedido
        this.isSaleRequestActiv = true;
        this.isSaleRequestTemp = true;
      })
    );
  }



  onclickProduct(value) {
    if (value.includes('*')) {
      this._qtdInput = value.substring(0, 1); // .emit(filter.substring(0, 1));
      this.clearInputProduct();
    } else {
      this.getProduct(value);
    }
    this.sub.push(

    );
    this.clearInputProduct();
    }

    getProduct(productCode) {
      this.sub.push(
        this.serviceProductService.getProduct(productCode)
      .subscribe(prod => {
        this.product = prod;
      },
      erro => {
        alert(erro.error);
      },
      () => {
        // fim
        if (this.product !== null) {
          this.updateSaleRequestTempProduct(this.product);
        } else {
          alert('Produto não encontrado');
        }
      })
      );
    }

    clearInputProduct() {
      this.inputProduct.nativeElement.value = '';
      this._qtdInput = 1;
    }

    clearInputSaleRequest() {
      this.inputSaleRequest.nativeElement.value = '';
    }

    updateSaleRequestTempProduct(_product: ModelProduct) {
      this.saleRequestProductTemp.ProductInternalCodeOnErp = _product.InternalCodeOnERP;
      this.saleRequestProductTemp.ProductPriceLookUpCode = _product.PriceLookupCode;
      if (this._qtdInput === undefined) {
        this._qtdInput = 1;
      }
      this.saleRequestProductTemp.Quantity = this._qtdInput;
      this.saleRequestProductTemp.SaleRequestTempId = this.saleRequestTemp.SaleRequestTempId;
      this.saleRequestProductTemp.TotalLiquid = (this._qtdInput * _product.SaleRetailPrice);
      this.saleRequestProductTemp.Value = _product.SaleRetailPrice;
      this.updateSaleRequestTemp(this.saleRequestProductTemp);
    }

    updateSaleRequestTemp(_saleRequestProductTemp: ModelSaleRequestProductTemp) {
      this.saleRequestTemp.Products = [];
      this.saleRequestTemp.Products.push(_saleRequestProductTemp);
      this.saleRequestTemp.TotalLiquid = (this.saleRequestTemp.TotalLiquid + _saleRequestProductTemp.TotalLiquid);
      // (this.saleRequestTemp.TotalLiquid + _saleRequestProductTemp.TotalLiquid);
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
          _saleRequestTempFull.Products = [];
          this.clearInputProduct();
          this.getSaleRequest();
        })
      );
    }




  onclickCancel() {
    this.isCancel = true;
  }

  sendCancelItem(idSaleRequestProductTemp) {
    this.sub.push(
      this.serviceSaleRequestProduct.deleteSaleRequestProductTemp(idSaleRequestProductTemp)
      .subscribe(resp => {
      },
      error => {
        alert('Erro ao excluir item');
      },
      () => {
        this.isCancel = false;
        this.getSaleRequest();
      }
      )
    );
  }

  onclickSave() {
    // this.populeSaleRequest(this.saleRequestTemp);
    this.finishSaleRequestTemp(this.saleRequestTemp);

  }

  finishSaleRequestTemp(_saleReqtemp) {
    this.sub.push(
      this.serviceSaleRequest.finishSaleRequestTemp(_saleReqtemp)
      .subscribe(response => {
        //
      },
      error => {
        alert('Erro ao grava o pedido');
      },
      () => {
        this.clearInputSaleRequest();
        this.isSaleRequestActiv = false;
        this.isSaleRequestTemp = false;
      })
    );
  }

  populeSaleRequest(saleReqTemp: ModelSaleRequestTemp) {
    this.saleRequestNew.DateHourOfCreation = 'Horario!!';
    this.saleRequestNew.DateOfCreation = 'somente dada';
    this.saleRequestNew.EnterpriseId = this.base.enterpriseId;
    this.saleRequestNew.FlagOrigin = '2';
    this.saleRequestNew.FlagStatus = 'ABERTO';
    this.saleRequestNew.IsCancelled = false;
    this.saleRequestNew.IsUsing = false;
    this.saleRequestNew.Peoples = 1;
    this.saleRequestNew.PersonalizedCode = saleReqTemp.PersonalizedCode;
    this.saleRequestNew.TotalLiquid = this.saleRequestTemp.TotalLiquid;
    this.populeSaleRequestProduct(saleReqTemp.Products);
  }
  populeSaleRequestProduct(saleRedProd: ModelSaleRequestProductTemp[]) {
    saleRedProd.forEach(p => {
      this.saleRequestProduct.Comments = null;
      this.saleRequestProduct.DateHourOfCreation = '';
      this.saleRequestProduct.IsCancelled = false;
      this.saleRequestProduct.IsDelivered = false;
      this.saleRequestProduct.ProductInternalCodeOnErp = p.Product.InternalCodeOnERP;
      this.saleRequestProduct.ProductPriceLookUpCode = p.ProductPriceLookUpCode;
      this.saleRequestProduct.ProductionStatus = 0;
      this.saleRequestProduct.Quantity = p.Quantity;
      // this.saleRequestProduct.SaleRequestId =  ?????
      this.saleRequestProduct.TotalLiquid = p.TotalLiquid;
      this.saleRequestProduct.Value = p.Value;
      this.saleRequestProducts.push(this.saleRequestProduct);
    });
    this.saleRequestNew.Products = this.saleRequestProducts;
    this.addSaleRequest(this.saleRequestNew);
  }


  addSaleRequest(_saleRequest: ModelSaleRequest) {
    this.sub.push(
      this.serviceSaleRequest.addSaleRequest(_saleRequest)
      .subscribe(response => {
        console.log('salvo');
      },
      error => {
        alert('Erro ao grava pedido');
      },
      () => {
        // fim
        this.saleRequestProducts = [];
        this.saleRequest.Products = [];
        this.clearInputSaleRequest();
        this.isSaleRequestActiv = false;
      })
    );
  }

  deleteSaleRequestTempFull(saleResTempId) {
    this.sub.push(
     //
    );
  }

  ngOnInit() {
    this.saleRequest = new ModelSaleRequest();
  }
  ngOnDestroy() {

  }
  ngOnChanges() {

  }


}

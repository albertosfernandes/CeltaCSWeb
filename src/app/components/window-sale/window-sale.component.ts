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
import Swal from 'sweetalert2';
import { error } from 'protractor';



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
  isPrinted = false;
  isShowSaleReqFull = false;
  @ViewChild('product') inputProduct;
  @ViewChild('saleRequest') inputSaleRequest;
  _qtdInput = 1;
  messageTop = 'TERMINAL LIVRE';

  saleRequestpersonalizedCode: any;
  saleRequestTemp = new ModelSaleRequestTemp;
  saleRequestTempNew = new ModelSaleRequestTemp;
  saleRequest = new ModelSaleRequest;
  meuSaleReq: ModelSaleRequest;
  saleRequestNew = new ModelSaleRequest;
  saleRequestProductTemp = new ModelSaleRequestProductTemp;
  // saleRequestProducts = new ModelSaleRequestProduct[] = [];
  saleRequestProduct = new ModelSaleRequestProduct;
  product = new ModelProduct;
  countProducts = 0;


  constructor(private serviceSaleRequestProduct: ServiceSaleRequestProductService, private serviceProduct: ServiceProductService,
              private serviceSaleRequest: ServiceSaleRequestService, private base: ServiceBaseService,
              private serviceProductService: ServiceProductService) { }

  onclickSaleRequest(saleRequestValue) {
    if (!saleRequestValue) {
      Swal.fire('Número de comanda inválido.', 'Digite o código ou faça a leitura pelo scanner. ', 'warning');
    } else {
      this.saleRequestpersonalizedCode = saleRequestValue;
      this.getSaleRequestTemp();

    }
  }

  onclickMoreSaleRequest() {
    this.isShowSaleReqFull = true;
  }

  // getSaleRequest() {
  //   // this.sub.push(
  //     this.serviceSaleRequest.getSaleRequest(this.base.enterpriseId, this.saleRequestpersonalizedCode)
  //   .subscribe(saleRequestData => {
  //     this.saleRequest = saleRequestData;
  //     // tslint:disable-next-line: max-line-length
  // tslint:disable-next-line: max-line-length
  //     console.log('saleReq Raiz: ' + saleRequestData.PersonalizedCode + saleRequestData.TotalLiquid + '> ' + saleRequestData.Products[0].ProductPriceLookUpCode);
  //     // tslint:disable-next-line: max-line-length
  // tslint:disable-next-line: max-line-length
  //     console.log('meuSaleReq dentro do subs: ' + this.saleRequest.PersonalizedCode + '? ' + this.saleRequest.TotalLiquid  + '> ' + this.saleRequest.Products[0].ProductPriceLookUpCode + this.saleRequest.PersonalizedCode);
  //   }, erro => {
  //     alert('Erro ao puxar os pedidos.');
  //   },
  //   () => {
  //     // finalizou
  //     if (this.saleRequest == null || this.saleRequest === undefined) {
  //       // entao vms ver se existe saleRequestTemp!
  //       this.getSaleRequestTemp();
  //     } else {
  //       // carrega ele então
  //       this.isSaleRequestActiv = true;
  //       // this.isSaleRequest = true;
  //     }
  //   })
  //   ;
  // }

  getSaleRequestTemp() {
    this.sub.push(
      this.serviceSaleRequest.getSaleRequestTemp(this.base.enterpriseId, this.saleRequestpersonalizedCode)
      .subscribe(saleRequestTempData => {
        this.saleRequestTemp = saleRequestTempData;
      },
      err => {
        Swal.fire('Erro ao carregar pedidos temporário.', err.error, 'error');
      },
      () => {
        if (this.saleRequestTemp == null || this.saleRequestTemp === undefined) {
              // vms criar uma nova Temp então
              this.addSaleRequestTemp();
        } else {
          // carrega ele então
          this.isSaleRequestActiv = true;
          this.isSaleRequestTemp = true;
          this.inputProduct.nativeElement.focus();
          this.countProducts = this.countProducts + 1;
        }
      })
    );
  }

  addSaleRequestTemp() {
    this.saleRequestTempNew.EnterpriseId = this.base.enterpriseId;
    this.saleRequestTempNew.PersonalizedCode = this.saleRequestpersonalizedCode;
    this.sub.push(
      this.serviceSaleRequest.addSaleRequestTemp(this.saleRequestTempNew)
      .subscribe(responseAdd => {
        // deu certo?
      },
      err => {
        Swal.fire('Erro ao adicionar pedido temporário.', err.error, 'error');
        // alert(err.error);
      },
      () => {
        // fim - salvo - recarrega lista de pedidos pedido
        this.isSaleRequestActiv = true;
        this.isSaleRequestTemp = true;
        this.getSaleRequestTemp();
      })
    );
  }



  onclickProduct(value) {
    if (value.includes('*')) {
      this._qtdInput = value.substring(0, 1); // .emit(filter.substring(0, 1));
      // this.clearInputProduct();
    } else {
      if (!value) {
        Swal.fire('Produto não encontrado.',
        'Para consulta digite apenas números ou faça a leitura do código de barras no scanner.', 'warning');
      } else {
        this.getProduct(value);
      }
    }
    }

    getProduct(productCode) {
      this.sub.push(
        this.serviceProductService.getProduct(productCode)
      .subscribe(prod => {
        this.product = prod;
      },
      err => {
        Swal.fire('Erro ao consultar produto.', err.error, 'error');
        // alert(erro.error);
      },
      () => {
        // fim
        if (this.product !== null) {
          this.messageTop = this.product.NameReduced;
          this.updateSaleRequestTempProduct(this.product);
        } else {
          // alert('Produto não encontrado');
          this.messageTop = 'Produto não encontrado';
          this.clearInputProduct();
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
      this.saleRequestTemp.TotalLiquid += this.saleRequestProductTemp.TotalLiquid;
      this.submitUpdateSaleRequestTemp(this.saleRequestTemp);
    }


    submitUpdateSaleRequestTemp (_saleRequestTempFull: ModelSaleRequestTemp) {
      this.sub.push(
        this.serviceSaleRequest.updateSaleRequestTemp(_saleRequestTempFull)
        .subscribe(response => {
          console.log('parece que atualizou!!');
        },
        err => {
          Swal.fire('Erro ao atualizar valor total do pedido.', err.error, 'error');
          // alert('Erro ao atualizar valor total do pedido');
        },
        () => {
          // fim
          this.saleRequestTemp.Products = [];
          _saleRequestTempFull.Products = [];
          this.clearInputProduct();
          this.getSaleRequestTemp();
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
      err => {
        Swal.fire('Erro ao excluir item.', err.error, 'error');
        // alert('Erro ao excluir item');
      },
      () => {
        this.isCancel = false;
        this.getSaleRequestTemp();
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
      err => {
        Swal.fire('Erro ao gravar o pedido.', err.error, 'error');
        // alert('Erro ao grava o pedido');
      },
      () => {
        this.clearInputSaleRequest();
        this.isSaleRequestActiv = false;
        this.isSaleRequestTemp = false;
        this.saleRequestTemp = new ModelSaleRequestTemp;
        this.isShowSaleReqFull = false;
        this.inputSaleRequest.nativeElement.focus();
        this.messageTop = 'TERMINAL LIVRE';
        this.countProducts = 0;
      })
    );
  }

  // populeSaleRequest(saleReqTemp: ModelSaleRequestTemp) {
  //   this.saleRequestNew.DateHourOfCreation = 'Horario!!';
  //   this.saleRequestNew.DateOfCreation = 'somente dada';
  //   this.saleRequestNew.EnterpriseId = this.base.enterpriseId;
  //   this.saleRequestNew.FlagOrigin = '2';
  //   this.saleRequestNew.FlagStatus = 'ABERTO';
  //   this.saleRequestNew.IsCancelled = false;
  //   this.saleRequestNew.IsUsing = false;
  //   this.saleRequestNew.Peoples = 1;
  //   this.saleRequestNew.PersonalizedCode = saleReqTemp.PersonalizedCode;
  //   this.saleRequestNew.TotalLiquid = this.saleRequestTemp.TotalLiquid;
  //   this.populeSaleRequestProduct(saleReqTemp.Products);
  // }
  // populeSaleRequestProduct(saleRedProd: ModelSaleRequestProductTemp[]) {
  //   saleRedProd.forEach(p => {
  //     this.saleRequestProduct.Comments = null;
  //     this.saleRequestProduct.DateHourOfCreation = '';
  //     this.saleRequestProduct.IsCancelled = false;
  //     this.saleRequestProduct.IsDelivered = false;
  //     this.saleRequestProduct.ProductInternalCodeOnErp = p.Product.InternalCodeOnERP;
  //     this.saleRequestProduct.ProductPriceLookUpCode = p.ProductPriceLookUpCode;
  //     this.saleRequestProduct.ProductionStatus = 0;
  //     this.saleRequestProduct.Quantity = p.Quantity;
  //     // this.saleRequestProduct.SaleRequestId =  ?????
  //     this.saleRequestProduct.TotalLiquid = p.TotalLiquid;
  //     this.saleRequestProduct.Value = p.Value;
  //     this.saleRequestProducts[] = [];
  //     this.saleRequestProducts.push(this.saleRequestProduct);
  //   });
  //   this.saleRequestNew.Products = this.saleRequestProducts;
  //   this.addSaleRequest(this.saleRequestNew);
  // }


  addSaleRequest(_saleRequest: ModelSaleRequest) {
    this.sub.push(
      this.serviceSaleRequest.addSaleRequest(_saleRequest)
      .subscribe(response => {
        console.log('salvo');
      },
      err => {
        Swal.fire('Erro ao gravar o pedido.', err.error, 'error');
        // alert('Erro ao grava pedido');
      },
      () => {
        // fim
        // this.saleRequestProducts = [];
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
    this.inputSaleRequest.nativeElement.focus();
     // this.saleRequest = new ModelSaleRequest();
    // this.saleRequestTemp = new ModelSaleRequestTemp();
  }
  ngOnDestroy() {

  }
  ngOnChanges() {
    this.getSaleRequestTemp();
  }


}

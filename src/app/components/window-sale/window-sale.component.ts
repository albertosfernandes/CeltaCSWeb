import { ModelTicket } from './../../model/model-ticket';
import { ModelGroup } from './../../model/model-group';
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
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { analyzeAndValidateNgModules } from '@angular/compiler';



@Component({
  selector: 'app-window-sale',
  templateUrl: './window-sale.component.html',
  styleUrls: ['./window-sale.component.css']
})
export class WindowSaleComponent implements OnInit, OnChanges, OnDestroy {

  debounce: Subject<string> = new Subject<string>();
  sub: Subscription[] = [];
  groups: ModelGroup[] = [];
  products: ModelProduct[] = [];
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
  isExecutingScript = false;
  isExecutingProd = false;
  closeResult: string;

  saleRequestpersonalizedCode: any;
  ticketAccessControl: ModelTicket;
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
  isModal = false;
  isModalProd = false;
  color = 'rgb(67, 125, 83)';
  isTicketAccessControl: any;
  myDate = new Date();


  constructor(private serviceSaleRequestProduct: ServiceSaleRequestProductService, private serviceProduct: ServiceProductService,
              private serviceSaleRequest: ServiceSaleRequestService, private base: ServiceBaseService,
              private serviceProductService: ServiceProductService, private modalService: NgbModal) { }

  onclickSaleRequest(saleRequestValue) {
    if (!saleRequestValue) {
      Swal.fire('Número de comanda inválido.', 'Digite o código ou faça a leitura pelo scanner. ', 'warning');
    } else {
      this.isTicketAccessControl = this.serviceSaleRequest.getExistTicketAccessControl();
      if (this.isTicketAccessControl) {
        // Valida se posso usar entao saleRequestValue
        this.saleRequestpersonalizedCode = parseInt(saleRequestValue, 10) ;
        this.getTicketAccessControl(saleRequestValue);
      } else {
        this.saleRequestpersonalizedCode = parseInt(saleRequestValue, 10) ;
        this.getSaleRequestTemp();
      }
    }
  }

  getTicketAccessControl(saleRequestTicketValue) {
    this.isExecutingScript = true;
    this.sub.push(
      this.serviceSaleRequest.getTicketAccessControl(saleRequestTicketValue)
      .subscribe(ticketData => {
        this.ticketAccessControl = ticketData;
      },
      err => {
        this.isExecutingScript = false;
        Swal.fire('Erro ao carregar comandas de catraca.', err.error, 'error');
      },
      () => {
        if (this.ticketAccessControl === null) {
          Swal.fire('Comanda não cadastrada!', ' ', 'warning');
          this.isExecutingScript = false;
        } else {
          this.validTicketAcessControl(this.ticketAccessControl);
        }
      })
    );
  }

  validTicketAcessControl(_ticketAccessControl: ModelTicket) {
    const hour = _ticketAccessControl.DateHourLastRelease.toString();
    const h = hour.substring(11);
    const h1 = h.substring(0, 2);
    const hourExpire = (this.myDate.getHours() + 5);
    if ( Number(h1) > hourExpire) {
      Swal.fire('Comanda Bloqueada!',
      'Esta comanda está bloqueada devido ao tempo desde sua última utilização que são de 5 horas. ', 'warning');
      this.isExecutingScript = false;
    } else {
      this.getSaleRequestTemp();
    }
  }

  onclickMoreSaleRequest() {
    this.isShowSaleReqFull = !this.isShowSaleReqFull;
  }

  getSaleRequestTemp() {
    this.isExecutingScript = true;
    this.sub.push(
      this.serviceSaleRequest.getSaleRequestTemp(this.base.enterpriseId, this.saleRequestpersonalizedCode)
      .subscribe(saleRequestTempData => {
        this.saleRequestTemp = saleRequestTempData;
      },
      err => {
        this.isExecutingScript = false;
        Swal.fire('Erro ao carregar pedidos temporário.', err.error, 'error');
      },
      () => {
        if (this.saleRequestTemp == null || this.saleRequestTemp === undefined) {
              // vms criar uma nova Temp então
              this.isExecutingScript = false;
              this.addSaleRequestTemp();
        } else {
          // carrega ele então
          this.isExecutingScript = false;
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
    this.saleRequestTempNew.PersonalizedCode = this.saleRequestpersonalizedCode.toString();
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
        // esta vazio sera que é pesquisa de produto?
        this.getGroups();
      } else {
        this.getProduct(value);
      }
    }
    }

    getGroups() {
      console.log('chame getGroups');
      this.sub.push(
        this.serviceProductService.getGroups()
        .subscribe(groups => {
          this.groups = groups;
        },
        err => {
          Swal.fire('Erro.',
        'Houve uma falha durante requisição de grupos.', 'error');
        },
        () => {
          if (!this.groups.length) {
            Swal.fire('Produto não encontrado.',
            'Para consulta digite apenas números ou faça a leitura do código de barras no scanner.', 'warning');
          } else {
              // exibir a lista de grupos
              console.log('itens' + this.groups[0].Name);
              this.showSelectGroups();


            }
          })
        );
    }

    getProductsByGroup(groupId) {
      console.log('chame getGroups');
      this.sub.push(
        this.serviceProductService.getProductsByGroup(groupId)
        .subscribe(productsArray => {
          this.products = productsArray;
        },
        err => {
          Swal.fire('Erro.',
        'Houve uma falha durante requisição de produtos.', 'error');
        },
        () => {
          if (!this.products.length) {
            Swal.fire('Nenhum produto foi encontrado neste grupo.',
            'Para consulta digite apenas números ou faça a leitura do código de barras no scanner.', 'warning');
          } else {
              // exibir a lista de grupos
              console.log('itens' + this.products[0].Name);
              this.showSelectProducts();
            }
          })
        );
    }

    // open(content) {
    //   this.modalService.open(content, ).result.then((result) => {
    //     this.closeResult = `Closed with: ${result}`;
    //   }, (reason) => {
    //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //   });
    // }

    // private getDismissReason(reason: any): string {
    //   if (reason === ModalDismissReasons.ESC) {
    //     return 'by pressing ESC';
    //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //     return 'by clicking on a backdrop';
    //   } else {
    //     return  `with: ${reason}`;
    //   }
    // }

    showSelectGroups() {
      this.isModal = !this.isModal;
      this.color = 'rgb(14, 26, 17)';
      // this.getGroups();
    }

    showSelectProducts() {
      this.isModal = false;
      this.isModalProd = !this.isModalProd;
      this.color = 'rgb(14, 26, 17)';
      // this.getGroups();
    }

    closeSelectGroups() {
      this.isModal = false;
      this.isModalProd = false;
      this.color = 'rgb(67, 125, 83)';
    }

    selectGroup(groupId) {
      console.log('Valor do grupo: ' + groupId);
      this.getProductsByGroup(groupId);
      this.isModal = false;
      this.color = 'rgb(67, 125, 83)';
    }

    selectProd(productId) {
      console.log(productId);
      this.isModalProd = false;
      this.color = 'rgb(67, 125, 83)';
    }
    // showSelectGroups() {
    //   const { value: fruit } = await Swal.fire({
    //     title: 'Select field validation',
    //     input: 'select',
    //     inputOptions: {
    //       'Fruits': {
    //         apples: 'Apples',
    //         bananas: 'Bananas',
    //         grapes: 'Grapes',
    //         oranges: 'Oranges'
    //       },
    //       'Vegetables': {
    //         potato: 'Potato',
    //         broccoli: 'Broccoli',
    //         carrot: 'Carrot'
    //       },
    //       'icecream': 'Ice cream'
    //     },
    //     inputPlaceholder: 'Select a fruit',
    //     showCancelButton: true,
    //     inputValidator: (value) => {
    //       return new Promise((resolve) => {
    //         if (value === 'oranges') {
    //           resolve()
    //         } else {
    //           resolve('You need to select oranges :)')
    //         }
    //       })
    //     }
    //   })

    //   if (fruit) {
    //     Swal.fire(`You selected: ${fruit}`)
    //   }
    // }

    getProduct(productCode) {
      this.isExecutingProd = true;
      this.sub.push(
        this.serviceProductService.getProduct(productCode)
      .subscribe(prod => {
        this.product = prod;
      },
      err => {
        this.isExecutingProd = false;
        Swal.fire('Erro ao consultar produto.', err.error, 'error');
        // alert(erro.error);
      },
      () => {
        // fim
        this.isExecutingProd = false;
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

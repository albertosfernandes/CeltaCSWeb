import { ServiceUsersService } from './../../service/service-users.service';
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
  isShowSaleReqFull = true;
  @ViewChild('product') inputProduct;
  @ViewChild('saleRequest') inputSaleRequest;
  @ViewChild('closebutton') closebutton;
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
  comments: string;
  commentsReceived: string;
  isShowProductInput = false;
  myPersonPersonalizedCode: string;
  isValidDateTime: any;


  constructor(private serviceSaleRequestProduct: ServiceSaleRequestProductService, private serviceProduct: ServiceProductService,
              private serviceSaleRequest: ServiceSaleRequestService, private base: ServiceBaseService,
              private serviceProductService: ServiceProductService, private modalService: NgbModal,
              private serviceUsers: ServiceUsersService) { }

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
          this.isShowSaleReqFull = false;
        } else {
          this.validTicketAcessControl(this.ticketAccessControl);
        }
      })
    );
  }

  validTicketAcessControl(_ticketAccessControl: ModelTicket) {
    if (_ticketAccessControl.DateHourLastRelease === null || _ticketAccessControl.DateHourLastRelease === undefined) {
      Swal.fire('Comanda Bloqueada!',
      'Comanda não liberada pela catraca. ', 'warning');
      this.isExecutingScript = false;
      this.isShowSaleReqFull = false;
    } else {
      this.sub.push(
        this.serviceSaleRequest.saleRequestIsValidDateTime(_ticketAccessControl.Number)
        .subscribe(respDateTimeValid => {
          this.isValidDateTime = respDateTimeValid;
        },
        err => {
          Swal.fire('Erro ao consultar data e hora da comanda.', err.error, 'error');
        },
        () => {
          if (!this.isValidDateTime) {
            Swal.fire('Comanda Bloqueada!',
                  'Tempo de utilização vencido. (5 horas) ', 'warning');
            this.isExecutingScript = false;
            this.isShowSaleReqFull = false;
          } else {
            this.getSaleRequestTemp();
          }
        })
      );
    }
  }

  onclickNotPrinted(idSaleRequestProductTemp) {
    this.sub.push(
      this.serviceSaleRequestProduct.markToPrint(idSaleRequestProductTemp)
      .subscribe(resp => {
        // trabalhando ...
      },
      err => {
        Swal.fire('Erro ao marcar pedido como entregue.', err.error, 'error');
      },
      () => {
        this.getSaleRequestTemp();
      })
    );
  }
  // sempre exibir
  // onclickMoreSaleRequest() {
  //   this.isShowSaleReqFull = !this.isShowSaleReqFull;
  // }

   getSaleRequestTemp() {
    this.isExecutingScript = true;
    this.myPersonPersonalizedCode = this.saleRequestpersonalizedCode;
    this.myPersonPersonalizedCode = ('000' + this.saleRequestpersonalizedCode).slice(-3);
    this.sub.push(
      this.serviceSaleRequest.getSaleRequestTemp(this.base.enterpriseId, this.myPersonPersonalizedCode)
      .subscribe(saleRequestTempData => {
        this.saleRequestTemp = saleRequestTempData;
      },
      err => {
        this.isExecutingScript = false;
        Swal.fire('Erro ao carregar pedidos temporário.', err, 'error');
      },
      () => {
        if (this.saleRequestTemp == null || this.saleRequestTemp === undefined) {
          // vms criar uma nova Temp então
          this.isExecutingScript = false;
          this.comments = '';
          this.addSaleRequestTemp();
    } else {
      // carrega ele então
      this.isExecutingScript = false;
      this.isShowProductInput = true;
      this.isSaleRequestActiv = true;
      this.isSaleRequestTemp = true;
      this.comments = '';
      this.countProducts = this.countProducts + 1;
      this.clearInputProduct();
    }
      }
      )
    );
  }

  async addSaleRequestTemp() {
    this.saleRequestTempNew.EnterpriseId = this.base.enterpriseId;
    this.saleRequestTempNew.PersonalizedCode = ('000' + this.saleRequestpersonalizedCode).slice(-3);
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
    if (value.includes('.')) {
      this._qtdInput = value.substring(0, 1); // .emit(filter.substring(0, 1));
      const p = value.substring(2);
      this.clearInputProduct();
      this.getProduct(p);
    } else {
      if (!value) {
        // esta vazio sera que é pesquisa de produto?
        Swal.fire('Atenção.',
        'Digite um código de produto ou passe no scanner.', 'warning');
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
              this.isModal = true;
              // this.showSelectGroups();
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
              this.isModalProd = true;
              this.isModal = false;
              this.showSelectProducts();
            }
          })
        );
    }

    backModal() {
      this.isModalProd = false;
      this.isModal = true;
    }

    showSelectGroups() {
      // this.isModal = true;
      this.color = 'rgb(14, 26, 17)';
      this.getGroups();
      // this.getGroups();
    }

    showSelectProducts() {
      // this.isModal = false;
      // this.isModalProd = !this.isModalProd;
      this.color = 'rgb(14, 26, 17)';
      // this.getGroups();
    }

    closeModal() {
      this.isModal = false;
      this.isModalProd = false;
    }

    closeSelectGroups() {
      this.isModal = false;
      this.isModalProd = false;
      this.color = 'rgb(67, 125, 83)';
    }

    selectGroup(groupId) {
      this.isModal = false;
      console.log('Valor do grupo: ' + groupId);
      this.getProductsByGroup(groupId);
      this.color = 'rgb(67, 125, 83)';
    }

    selectProd(productId) {
      console.log(productId);
      // this.isModalProd = false;
      this.color = 'rgb(67, 125, 83)';
    }

    onclickSelctProduct(pluProductCode) {
      this.getProduct(pluProductCode);
      this.isModalProd = false;
      this.isModal = true;
      this.closebutton.nativeElement.click();
    }

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
      this.inputProduct.nativeElement.focus();
    }

    clearInputSaleRequest() {
      this.inputSaleRequest.nativeElement.value = '';
    }

    onclickEsc() {
      window.location.reload();
    }

    async onclickProductComments(saleRequestProductIdValue) {
      const { value: _comments } = await Swal.fire({
        title: 'Observação',
        text: 'Inserir observação sobre o produto',
        // html: '<input id="swal-comment" class="swal2-input">' ,
        input: 'text',
        showCancelButton: true ,
        confirmButtonColor: 'green',
        focusConfirm: false,
        inputValue: this.commentsReceived
      });

        // preConfirm: (textValue) => {
        //   if (this.commentsReceived != null) {
        //     (<HTMLInputElement>document.getElementById('swal-comment')).innerText = this.commentsReceived;
        //   }
        //   let inputValue = (<HTMLInputElement>document.getElementById('swal-comment')).value;
        //   return [
        //     inputValue = (<HTMLInputElement>document.getElementById('swal-comment')).value
        //   ];
        // },
        // });

        if (_comments) {
          this.comments = _comments;
          this.sendCommentsProduct(this.comments, saleRequestProductIdValue);
        }


        // .then((result) => {
        // if (result.value) {
        //     this.comments = result.value;
        //     this.sendCommentsProduct(this.comments, saleRequestProductIdValue);
        // } else {
        //   // nenhuma observação adicionada
        // }});
    }

    existComments(saleRequestProductId) {
      this.sub.push(
        this.serviceSaleRequestProduct.existsComments(saleRequestProductId)
        .subscribe(resp => {
          if (resp != null || resp !== undefined) {
            this.commentsReceived = resp;
          }
        },
        err => {

        },
        () => {
          // .
          console.log('comments value: ' + this.commentsReceived);
          this.onclickProductComments(saleRequestProductId);
        })
      );
    }

    sendCommentsProduct(_comments, _saleRequestProductIdValue) {
      this.sub.push(
        this.serviceSaleRequestProduct.addSaleRequestProductComments(_comments, _saleRequestProductIdValue)
        .subscribe(resp => {

        },
        err => {
          Swal.fire('Erro ao atualizar observação de pedido.', err.error, 'error');
        },
        () => {
          // this.saleRequestProductTemp.Comments = _comments;
          this.getSaleRequestTemp();
        })
      );
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
      this.saleRequestProductTemp.IsPrinted = false;
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
          // this.clearInputProduct();
          this.getSaleRequestTemp();
        })
      );
    }

  // onclickCancel() {
  //   this.isCancel = true;
  // }

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

  async onclickSave() {
    const { value: formValues } = await Swal.fire({
      title: 'Pedido com entrega?',
      text: 'Informe o número da bandeira:',
      html: '<input id="band" type="number" class="swal2-input" autofocus>',
      // input: 'number',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: 'green',
      onOpen: () => {
        // const test = Swal.getInput;
        // test.focus();
      },
      preConfirm: () => {
        let inputValueBand = (<HTMLInputElement>document.getElementById('band')).value;
        return [
          inputValueBand = (<HTMLInputElement>document.getElementById('band')).value
        ];
      }
      });
      if (formValues) {
        this.saleRequestTemp.DeliveryControl = formValues[0];
        this.finishSaleRequestTemp(this.saleRequestTemp);
      }
      // .then((result) => {
      // if (result.value) {
      //     // Swal.fire('Result:' + result.value);
      //     this.saleRequestTemp.DeliveryControl = result.value;
      //     this.finishSaleRequestTemp(this.saleRequestTemp);
      // } else {
      //   this.getSaleRequestTemp();
      // }});
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
        this.isShowProductInput = false;
        this.isSaleRequestActiv = false;
        this.isSaleRequestTemp = false;
        this.saleRequestTemp = new ModelSaleRequestTemp;
        this.isShowSaleReqFull = false;
        this.inputSaleRequest.nativeElement.focus();
        this.messageTop = 'TERMINAL LIVRE';
        this.countProducts = 0;
        window.location.reload();
      })
    );
  }


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

  onclickPlusQuantity(saleRequestProductId) {
   this.sub.push(
     this.serviceProductService.updatePlusQuantity(saleRequestProductId)
     .subscribe(resp => {

     },
     err => {
      Swal.fire('Erro ao gravar o pedido.', err.error, 'error');
     },
     () => {
      this.getSaleRequestTemp();
     })
   );
  }

  onclickMinusQuantity(saleRequestProductId) {
    this.sub.push(
      this.serviceProductService.updateMinusQuantity(saleRequestProductId)
      .subscribe(resp => {

      },
      err => {
       Swal.fire('Erro ao gravar o pedido.', err.error, 'error');
      },
      () => {
       this.getSaleRequestTemp();
      })
    );
  }


  ngOnInit() {
    this.inputSaleRequest.nativeElement.focus();
     // this.saleRequest = new ModelSaleRequest();
    // this.saleRequestTemp = new ModelSaleRequestTemp();
  }
  ngOnDestroy() {
    this.sub.forEach(sub => sub.unsubscribe);
  }
  ngOnChanges() {
    this.getSaleRequestTemp();
  }

}

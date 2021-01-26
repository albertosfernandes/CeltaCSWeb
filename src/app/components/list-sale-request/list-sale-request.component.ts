import { ServiceUsersService } from './../../service/service-users.service';
import { ModelSaleRequestProduct } from './../../model/model-saleRequestProduct';
import { ServiceSaleRequestProductService } from './../../service/service-sale-request-product.service';
import { Subscription } from 'rxjs';
import { ServiceSaleRequestService } from 'src/app/service/service-sale-request.service';
import { ServiceBaseService } from 'src/app/service/service-base.service';
import { ModelSaleRequest } from 'src/app/model/model-saleRequest';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-sale-request',
  templateUrl: './list-sale-request.component.html',
  styleUrls: ['./list-sale-request.component.css']
})
export class ListSaleRequestComponent implements OnInit, OnChanges, OnDestroy {

  constructor(private base: ServiceBaseService, private serviceSaleRequest: ServiceSaleRequestService,
              private serviceSaleRequestProduct: ServiceSaleRequestProductService,
              private serviceUsers: ServiceUsersService) { }

  @Input() saleRequestPersonalizedCode = 0;
  isShow = false;
  saleRequest = new ModelSaleRequest;
  sub: Subscription[] = [];
  isCancelSaleReq = false;
  userAndPasswordResp: any;
  userValidResp: any;
  personalizedCode: string;
  password: string;

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
      err => {
        Swal.fire('Falha ao carregar pedido.', err.error, 'error');
      },
      () => {
        // fim
      })
    );
  }

  async onclickShowCancel() {
    const { value: formValues } = await Swal.fire({
      title: 'Autenticação de usuário.',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Código de usuário">' +
        '<input id="swal-input2" class="swal2-input" type="password" placeholder="Senha">',
      focusConfirm: false,
      preConfirm: () => {
        let inputValue = (<HTMLInputElement>document.getElementById('swal-input1')).value;
        inputValue = (<HTMLInputElement>document.getElementById('swal-input2')).value;
        return [
          inputValue = (<HTMLInputElement>document.getElementById('swal-input1')).value,
          inputValue = (<HTMLInputElement>document.getElementById('swal-input2')).value,
        ];
      }
    });

    if (formValues) {
      this.personalizedCode = formValues[0];
      this.password = formValues[1];
      this.validUserAndPassword(this.personalizedCode, this.password);
    }
  }

    async validUserAndPassword(userPersonalizedCode, password) {
      this.sub.push(
        this.serviceUsers.getUserAndPassword(userPersonalizedCode, password)
        .subscribe(resp => {
          this.userAndPasswordResp = resp;
        },
        err => {
          Swal.fire('Falha ao validar usuário.', err.error, 'error');
          console.log('Erro: ' + err.error);
        },
        () => {
          // fim
          if (this.userAndPasswordResp) {
            this.validUserPermission(this.personalizedCode);
          } else {
            Swal.fire(' ', 'Código de usuário ou senha inválido. ', 'warning');
          }
        })
      );
    }

    validUserPermission(userPersonalizedCode) {
      this.sub.push(
        this.serviceUsers.getUserPermission(userPersonalizedCode)
        .subscribe(resp => {
          this.userValidResp = resp;
        },
        err => {
          Swal.fire('Falha ao validar permissão de usuário.', err.error, 'error');
        },
        () => {
          // fim
          if (this.userValidResp) {
            this.isCancelSaleReq = !this.isCancelSaleReq;
          } else {
            Swal.fire(' ', 'Este usuário não possue permissão de cancelar. ', 'warning');
          }
        })
      );
    }

  sendCancelItem(saleRequestProductId) {
    this.sub.push(
      this.serviceSaleRequestProduct.deleteSaleRequestProduct(saleRequestProductId)
      .subscribe(resp => {

      },
      err => {
        Swal.fire('Erro ao cancelar.', err.error, 'error');
      },
      () => {
        // fim
        this.isCancelSaleReq = false;
        this.loadSaleRequest(this.saleRequestPersonalizedCode);
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

import { Subscription } from 'rxjs';
import { ModelSaleRequestProductTemp } from 'src/app/model/model-saleRequestProductTemp';
import { ModelProduct } from './model/model-product';
import { Component, OnChanges, OnInit } from '@angular/core';
import { ModelSaleRequestTemp } from './model/model-saleRequestTemp';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {


  isNewSaleRequestTemp: boolean;
  isAddProduct = false;
  product: ModelProduct;
  subscription: Subscription[] = [];
  saleRequestProductTemp = new ModelSaleRequestProductTemp();
  saleRequestTemp: ModelSaleRequestTemp;
  quantidade: number;
  _isCancel = false;

  receiveSaleRequest(isSaleRequestNew) {
    this.isNewSaleRequestTemp = isSaleRequestNew;
  }

  recebeProduct(myprod: ModelProduct) {
    this.product = myprod;
  }

  receiveIsCancel($event) {
    this._isCancel = $event;
    console.log('app.comp isCancel: ' + this._isCancel);
  }

  receiveCurrentSaleRequestTemp(saleRequestTempCode) {
    console.log('Comanda temp aberta: ' + saleRequestTempCode);
  }

  receiveSaleRequestTemp(saleRequestTemp: ModelSaleRequestTemp) {
    console.log('toda comanda ' + saleRequestTemp);
    this.saleRequestTemp = saleRequestTemp;
    this.isAddProduct = true;
    this.isNewSaleRequestTemp = true;
  }

  receiveQtd(_quantidade) {
    this.quantidade = _quantidade;
    alert(_quantidade);
  }

  ngOnInit() {

  }

  ngOnChanges() {

    }
}

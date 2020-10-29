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

  receiveSaleRequest(isSaleRequestNew) {
    this.isNewSaleRequestTemp = isSaleRequestNew;
  }

  recebeProduct(myprod: ModelProduct) {
    console.log('app component produto recebido: ' + myprod.NameReduced);
    this.product = myprod;
    // this.updateSaleRequestTempProduct(myprod);
    console.log('product: ' + myprod.NameReduced);
  }

  receiveCurrentSaleRequestTemp(saleRequestTempCode) {
    console.log('Comanda temp aberta: ' + saleRequestTempCode);
  }

  receiveSaleRequestTemp(saleRequestTemp) {
    console.log('toda comanda ' + saleRequestTemp.PersonalizedCode);
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
    alert('recebeu valor do input é novo? ' + this.isNewSaleRequestTemp);
    alert('produto novo: ' + this.product);
  }
}

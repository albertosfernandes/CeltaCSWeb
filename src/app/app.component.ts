import { ModelProduct } from './model/model-product';
import { Component, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {


  isNewSaleRequest: boolean;
  product: ModelProduct;
  quantidade: number;

  receiveSaleRequest(isSaleRequestNew) {
    this.isNewSaleRequest = isSaleRequestNew;
  }

  recebeProduct(myprod: ModelProduct) {
    console.log('app component produto recebido: ' + myprod.NameReduced);
    this.product = myprod;
    console.log('product: ' + myprod.NameReduced);
  }

  receiveQtd(_quantidade) {
    this.quantidade = _quantidade;
    alert(_quantidade);
  }

  ngOnInit() {

  }

  ngOnChanges() {
    alert('recebeu valor do input é novo? ' + this.isNewSaleRequest);
    alert('produto novo: ' + this.product);
  }
}

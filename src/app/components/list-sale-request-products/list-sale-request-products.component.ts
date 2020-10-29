import { ModelProduct } from './../../model/model-product';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-list-sale-request-products',
  templateUrl: './list-sale-request-products.component.html',
  styleUrls: ['./list-sale-request-products.component.css']
})
export class ListSaleRequestProductsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() _productReceived: ModelProduct;
  @Input() _qtdInput: number;
  products: ModelProduct[] = [];
  quantidade = 1;
  constructor() { }


  ngOnChanges() {
    // if (this._qtdInput !== undefined) {
    //   alert('opa tem quantidade nova ' + this._qtdInput);
    //   this.quantidade = this._qtdInput;
    //   this._qtdInput = undefined;
    // } else {
    //   console.log('lista add ' + this._productReceived.NameReduced);
    //   this.products.push(this._productReceived);
    // }
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }

}

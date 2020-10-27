import { ModelProduct } from './../../model/model-product';
import { ServiceProductService } from './../../service/service-product.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-input-product',
  templateUrl: './input-product.component.html',
  styleUrls: ['./input-product.component.css']
})
export class InputProductComponent implements OnInit {

  listenInput: Subject<string> = new Subject<string>();
  product: ModelProduct;
  productCode: string;
  @Output() productEmitter = new EventEmitter();
  @Output() qtd = new EventEmitter();
  constructor(private serviceProductService: ServiceProductService) { }

  onEnter() {
    console.log('enter');
  }

  getProduct(productCode) {
    this.serviceProductService.getProduct(productCode)
    .subscribe(prod => {
      this.product = prod;
    },
    erro => {
      alert(erro.error);
    },
    () => {
      // fim
      this.productEmitter.emit(this.product);
      console.log(this.product);
    });
  }

  enableInputValue() {
    this.listenInput
    .pipe()
    .subscribe(filter => {
      console.log('tem algo? ' + filter);
      if (filter.includes('*')) {
        this.qtd.emit(filter.substring(0, 1));
      } else {
        this.productCode = filter;
        this.getProduct(this.productCode);
      }
    },
    erro => {
      console.error(erro.error);
      alert(erro.error);
    },
    () => {

    } );
  }
  ngOnInit() {
    this.enableInputValue();
  }

}

import { ModelSaleRequestTemp } from 'src/app/model/model-saleRequestTemp';
import { ModelProduct } from './../../model/model-product';
import { ServiceProductService } from './../../service/service-product.service';
import { Component, OnInit, Output, EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { SafeMethodCall } from '@angular/compiler';
import { ModelSaleRequestProductTemp } from 'src/app/model/model-saleRequestProductTemp';

@Component({
  selector: 'app-input-product',
  templateUrl: './input-product.component.html',
  styleUrls: ['./input-product.component.css']
})
export class InputProductComponent implements OnInit, OnChanges, OnDestroy {

  listenInput: Subject<string> = new Subject<string>();
  product: ModelProduct;
  productCode: string;
  subscription: Subscription[] = [];
  saleRequestProductTemp = new ModelSaleRequestProductTemp();
  saleRequestTemp = new ModelSaleRequestTemp();
  @Output() productEmitter = new EventEmitter();
  @Output() qtd = new EventEmitter();



  constructor(private serviceProductService: ServiceProductService) { }

  onEnter() {
    console.log('enter');
  }

  getProduct(productCode) {
    this.subscription.push(
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
    })
    );
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
  ngOnDestroy() {
    this.subscription.forEach(element => element.unsubscribe);
  }
  ngOnChanges() {
  }

}

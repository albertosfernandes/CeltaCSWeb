import { ModelProduct } from './../model/model-product';
import { ServiceBaseService } from './service-base.service';
import { Injectable } from '@angular/core';
import { map, catchError, tap  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceProductService {

  constructor(private base: ServiceBaseService) { }

  getProduct(productCode) {
    return this.base.httpBase
    .get<ModelProduct>(this.base.urlapi + '/api/APIProduct/get?_enterpriseId=' + this.base.enterpriseId +  '&_productCode=' + productCode)
    .pipe(
      tap()
    );
  }
}

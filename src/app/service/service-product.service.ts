import { ModelProduct } from './../model/model-product';
import { ServiceBaseService } from './service-base.service';
import { Injectable } from '@angular/core';
import { map, catchError, tap  } from 'rxjs/operators';
import { ModelGroup } from '../model/model-group';
import { injectComponentFactoryResolver } from '@angular/core/src/render3';

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

  getGroups() {
    return this.base.httpBase
    .get<ModelGroup[]>(this.base.urlapi + '/api/APIGroups/GetAll?_enterpriseId=' + this.base.enterpriseId)
    .pipe(
      tap(
        data => console.log(data),
        error => console.log(error)
      )
    );
  }

  getProductsByGroup(groupId) {
    return this.base.httpBase
    .get<ModelProduct[]>
    (this.base.urlapi + '/api/APIProduct/GetAllByGroup?_enterpriseId=' + this.base.enterpriseId + '&_groupCode=' + groupId)
    .pipe(
      tap(
        data => console.log(data),
        error => console.log(error)
      )
    );
  }

  updatePlusQuantity(saleRequestProductId) {
    return this.base.httpBase
    .get(this.base.urlapi + '/api/APISaleRequestProduct/UpdateQuantityPlus?_saleRequestProductTempId=' + saleRequestProductId)
    .pipe(
      tap(
        data => console.log(data),
        err => console.log(err.error)
      )
    );
  }

  updateMinusQuantity(saleRequestProductId) {
    return this.base.httpBase
    .get(this.base.urlapi + '/api/APISaleRequestProduct/UpdateQuantityMinus?_saleRequestProductTempId=' + saleRequestProductId)
    .pipe(
      tap(
        data => console.log(data),
        err => console.log(err.error)
      )
    );
  }
}

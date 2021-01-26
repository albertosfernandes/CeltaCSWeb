// import { error } from 'protractor';
import { ServiceBaseService } from './service-base.service';
import { Injectable } from '@angular/core';
import { map, catchError, tap  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceSaleRequestProductService {

  constructor(private base: ServiceBaseService) { }

  updateSaleRequestProductTemp(_saleRequestProductTemp) {
    return this.base.httpBase
    .put(this.base.urlapi + '/api/apisale...?', _saleRequestProductTemp);
  }

  deleteSaleRequestProductTemp(_saleRequestProductTempId) {
    return this.base.httpBase
    .get(this.base.urlapi + '/api/APISaleRequestProduct/DeleteSaleRequestProductTemp?id=' + _saleRequestProductTempId);
  }

  deleteSaleRequestProduct(_saleRequestProductId) {
    return this.base.httpBase
    .get(this.base.urlapi + '/api/APISaleRequestProduct/DeleteSaleRequestProduct?id=' + _saleRequestProductId)
    .pipe(
      tap(
        data => console.log(data),
        error => console.log(error)
        )
      );
  }

  addSaleRequestProductTemp(_saleRequestProductTemp) {
    return this.base.httpBase
    .post(this.base.urlapi + '/api/APISaleRequestProduct/Add', _saleRequestProductTemp)
    .pipe(
      tap(

      )
    );
  }

  addSaleRequestProductComments(_comments, _saleRequestProductIdValue) {
    return this.base.httpBase
    .get(this.base.urlapi +
      '/api/APISaleRequestProduct/UpdateSaleRequestProductComments?_saleRequestProductTempId=' + _saleRequestProductIdValue
      + '&_comments=' + _comments)
    .pipe(
      tap(
        data => console.log(data),
        err => console.error(err.error)
      )
    );
  }
}

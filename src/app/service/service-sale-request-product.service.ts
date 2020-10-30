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

  addSaleRequestProductTemp(_saleRequestProductTemp) {
    return this.base.httpBase
    .post(this.base.urlapi + '/api/APISaleRequestProduct/Add', _saleRequestProductTemp)
    .pipe(
      tap(

      )
    );
  }
}

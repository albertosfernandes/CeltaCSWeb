import { ServiceBaseService } from './service-base.service';
import { Injectable } from '@angular/core';
import { map, catchError, tap  } from 'rxjs/operators';
import { ModelSaleRequest } from '../model/model-saleRequest';
import { ModelSaleRequestTemp } from '../model/model-saleRequestTemp';

@Injectable({
  providedIn: 'root'
})
export class ServiceSaleRequestService {

  constructor(private base: ServiceBaseService) { }

  getSaleRequestsAll(enterpriseId) {
    return this.base.httpBase
    .get<ModelSaleRequest[]>(this.base.urlapi + '/api/apiSaleRequest/GetAllById?_enterpriseId='
    + enterpriseId + '&isUsing=0&isCancel=0&&isDelivered=0')
    .pipe(
      tap()
    );
  }

  getSaleRequest(enterpriseId, saleRequestPersonCode) {
    return this.base.httpBase
    .get<ModelSaleRequest>(this.base.urlapi + '/api/apiSaleRequest/Get?_enterpriseId=' + enterpriseId +
        '&_personalizedCode=' + saleRequestPersonCode + '&_considerUsing=false')
    .pipe(
      tap(
        data => console.log(data),
        error => console.log('error ' + error)
      )
    );
  }

  getSaleRequestTemp(enterpriseId, saleRequestTempCode) {
    return this.base.httpBase
    .get<ModelSaleRequestTemp>(this.base.urlapi + '/api/apiSaleRequest/GetTemp?_enterpriseId=' + enterpriseId +
        '&_personalizedCode=' + saleRequestTempCode + '&_considerUsing=false')
    .pipe(
      tap()
    );
  }

  addSaleRequestTemp(saleRequestTemp: ModelSaleRequestTemp) {
    return this.base.httpBase
    .post(this.base.urlapi + '/api/apiSaleRequest/AddSaleRequestTemp', saleRequestTemp);
  }

  updateSaleRequestTemp(saleRequestTemp: ModelSaleRequestTemp) {
    return this.base.httpBase
    .put(this.base.urlapi + '/api/apiSaleRequest/UpdateSaleRequestTemp', saleRequestTemp)
    .pipe(
      tap(
        data => console.log(data),
        error => console.log(error)
      )
    );
  }

  deleteSaleRequestTemp(saleRequestTempId) {
    return this.base.httpBase
    .get(this.base.urlapi + '/api/apiSaleRequest/');
  }

  finishSaleRequestTemp(saleRequestTemp: ModelSaleRequestTemp) {
    return this.base.httpBase
    .post(this.base.urlapi + '/api/apiSaleRequest/FinishSaleRequestTemp', saleRequestTemp);
  }

  addSaleRequest(saleRequest: ModelSaleRequest) {
    return this.base.httpBase
    .post(this.base.urlapi + '/api/apiSaleRequest/AddSaleRequest', saleRequest);
  }
}

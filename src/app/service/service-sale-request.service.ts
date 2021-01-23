import { ModelTicket } from './../model/model-ticket';
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
      tap(
        data => console.log(data),
        error => console.log('erro: ' + error)
      )
    );
  }

  getExistTicketAccessControl() {
    return this.base.httpBase
    .get<boolean>(this.base.urlapi + '/api/APISaleRequest/ExistTicketAccessControl')
    .pipe(
      tap(
        data => console.log(data),
        error => console.log('erro: ' + error)
      )
    );
  }

  getTicketAccessControl(personalizedCode) {
    return this.base.httpBase
    .get<ModelTicket>(this.base.urlapi + '/api/APISaleRequest/TicketIsPermited?_personalizedCode=' + personalizedCode)
    .pipe(
      tap(
        data => console.log(data),
        error => console.log('erro: ' + error)
      )
    );
  }


  addSaleRequestTemp(saleRequestTemp: ModelSaleRequestTemp) {
    return this.base.httpBase
    .post(this.base.urlapi + '/api/apiSaleRequest/AddSaleRequestTemp', saleRequestTemp, { responseType: 'text' });
  }

  updateSaleRequestTemp(saleRequestTemp: ModelSaleRequestTemp) {
    return this.base.httpBase
    .post(this.base.urlapi + '/api/apiSaleRequest/UpdateSaleRequestTemp', saleRequestTemp, { responseType: 'text' })
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
    .post(this.base.urlapi + '/api/apiSaleRequest/FinishSaleRequestTemp', saleRequestTemp, { responseType: 'text' });
  }

  addSaleRequest(saleRequest: ModelSaleRequest) {
    return this.base.httpBase
    .post(this.base.urlapi + '/api/apiSaleRequest/AddSaleRequest', saleRequest, { responseType: 'text' });
  }
}

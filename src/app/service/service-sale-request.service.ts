import { ServiceBaseService } from './service-base.service';
import { Injectable } from '@angular/core';
import { ModelSaleRequest } from '../model/model-saleRequest';

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

    );
  }
}
import { ServiceBaseService } from './service-base.service';
import { Injectable } from '@angular/core';
import { map, catchError, tap  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceSaleRequestProductService {

  constructor(private base: ServiceBaseService) { }

  updateSaleRequestProductTemp(_saleRequestProductTemp) {
    this.base.httpBase
    .put(this.base.urlapi + '/api/apisale...?', _saleRequestProductTemp);
  }
}

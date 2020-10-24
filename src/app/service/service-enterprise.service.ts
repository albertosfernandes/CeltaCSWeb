import { ModelEnterprise } from './../model/model-enterprise';
import { ServiceBaseService } from './service-base.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceEnterpriseService {

  constructor(private base: ServiceBaseService) { }

  getAllEnterprises() {
    return this.base.httpBase
    .get<ModelEnterprise[]>(this.base.urlapi + '/api/apinavsSetting/getAllEnterprises')
    .pipe(

    );
  }

  getEnterprise(enterpriseId) {
    return this.base.httpBase
    .get<ModelEnterprise>(this.base.urlapi + '/api/apinavsSetting/getEnterprise?id=' + enterpriseId)
    .pipe(

    );
  }
}

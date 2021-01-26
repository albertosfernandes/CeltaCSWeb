import { Injectable } from '@angular/core';
import { error } from 'protractor';
import { tap } from 'rxjs/operators';
import { ServiceBaseService } from './service-base.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceUsersService {

  constructor(private base: ServiceBaseService) { }

  getUserAndPassword(userPersonalizedCode, password) {
    return this.base.httpBase
    .get<boolean>(this.base.urlapi + '/api/APIUsers/ValidPassword?personalizedCode=' + userPersonalizedCode + '&password=' + password)
    .pipe(
      tap(
        data => console.log(data),
        erro => console.log(erro)
      )
    );
  }

  getUserPermission(userPersonlizedCode) {
    return this.base.httpBase
    .get<boolean>(this.base.urlapi + '/api/APIUsers/UserPermissionCancel?personalizedCode=' + userPersonlizedCode)
    .pipe(
      tap(
        data => console.log(data),
        err => console.log(err.error)
      )
    );
  }
}

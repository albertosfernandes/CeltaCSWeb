import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'protractor';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ServiceBaseService } from './service-base.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceUsersService {

  constructor(private base: ServiceBaseService, private auth: AuthService) { }

  getUserAndPassword(userPersonalizedCode, password) {
    return this.base.httpBase
    .get<boolean>(this.base.urlapi + '/api/APIUsers/ValidDeHashPassword?personalizedCode=' + userPersonalizedCode +
     '&cipherString=' + password)
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

  // authenticateUser(userPersonalizedCode, password) {
  //   return this.base.httpBase
  //   .get(this.base.urlapi + '/api/APIusers/ValidUserDeHashPasswordCookie?personalizedCode='
  //   + userPersonalizedCode + '&cipherString=' + password, {observe: 'response'})
  //   .pipe(
  //     tap(
  //       resp =>
  //       console.log('Meu Header é: ' + resp.headers.getAll('CeltaCSWebCookie'))
  //     )
  //   );
  // }

  loginUser(userPersonalizedCode, password): Observable<HttpResponse<Object>> {
    const httpHeaders = new HttpHeaders();
     httpHeaders.keys();

      return this.base.httpBase.get<any>(this.base.urlapi +
      '/api/APIusers/ValidUserDeHashPasswordCookie?personalizedCode=' + userPersonalizedCode +
      '&cipherString=' + password, {headers: httpHeaders, observe: 'response' })
      .pipe(
         tap(
           resp => console.log('response >', resp.headers),
           err => console.log(err.error))
    );
}
}

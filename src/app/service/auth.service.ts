import { Injectable } from '@angular/core';
import { ServiceBaseService } from './service-base.service';

const KEY = 'celtaCSWebCookie';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private base: ServiceBaseService) { }

  hasAuthenticated() {
    return this.getAuth();
  }

  getAuth() {
    return window.localStorage.getItem(KEY);
  }

  setAuth(token) {
    window.localStorage.setItem(KEY, token);
  }

  removeAuth() {
    window.localStorage.removeItem(KEY);
  }
}

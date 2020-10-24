import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

 const API = '';

@Injectable({
  providedIn: 'root'
})
export class ServiceBaseService {

  constructor(private http: HttpClient) {
    this.httpBase = this.http;
    this.urlapi = API;
  }

  public urlapi: string;
  public httpBase: HttpClient;

  gethttpBase() {
    return this.httpBase;
  }
}


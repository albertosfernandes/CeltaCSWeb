import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

 const API = 'http://localhost:1099';
 // const API = 'http://localhost:1096';
 // const API = 'http://cloud.celtaware.com.br:1096';

@Injectable({
  providedIn: 'root'
})
export class ServiceBaseService {

  constructor(private http: HttpClient) {
    this.httpBase = this.http;
    this.urlapi = API;
    this.enterpriseId = 3;
  }

  public urlapi: string;
  public httpBase: HttpClient;
  public enterpriseId: number;

  gethttpBase() {
    return this.httpBase;
  }
}


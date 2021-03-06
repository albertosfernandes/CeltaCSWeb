import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

 const API = 'http://localhost:10965';
 // const API = 'http://192.168.15.250:1096';
 // const API = 'http://localhost:1099';

@Injectable({
  providedIn: 'root'
})
export class ServiceBaseService {

  constructor(private http: HttpClient) {
    this.httpBase = this.http;
    this.urlapi = API;
    this.enterpriseId = 2;
  }

  public urlapi: string;
  public httpBase: HttpClient;
  public enterpriseId: number;

  gethttpBase() {
    return this.httpBase;
  }
}


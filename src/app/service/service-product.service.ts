import { ServiceBaseService } from './service-base.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceProductService {

  constructor(private base: ServiceBaseService) { }
}

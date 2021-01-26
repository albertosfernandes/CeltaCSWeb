import { ModelSaleRequestProductTemp } from './model-saleRequestProductTemp';

export class ModelSaleRequestTemp {
  SaleRequestTempId: number;
  PersonalizedCode: string;
  EnterpriseId: number;
  TotalLiquid: number;
  Products: ModelSaleRequestProductTemp[];
  DeliveryControl: number;
}

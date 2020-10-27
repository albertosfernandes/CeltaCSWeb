import { ModelSaleRequestProductTemp } from './model-saleRequestProductTemp';

export class ModelSaleRequestTemp {
  saleRequestTempId: number;
  personalizedCode: string;
  enterpriseId: number;
  totalLiquid: number;
  products: ModelSaleRequestProductTemp[];
}

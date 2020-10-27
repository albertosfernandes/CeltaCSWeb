import { ModelSaleRequestTemp } from './model-saleRequestTemp';
import { ModelProduct } from './model-product';

export class ModelSaleRequestProductTemp {
  saleRequestProductTempId: number;
  productPriceLookUpCode: string;
  value: number;
  quantity: number;
  totalLiquid: number;
  product: ModelProduct;
  saleRequestTemp: ModelSaleRequestTemp;
  saleRequestTempId: number;
}

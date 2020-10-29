import { ModelSaleRequestTemp } from './model-saleRequestTemp';
import { ModelProduct } from './model-product';

export class ModelSaleRequestProductTemp {
  SaleRequestProductTempId: number;
  ProductPriceLookUpCode: string;
  Value: number;
  Quantity: number;
  TotalLiquid: number;
  Product: ModelProduct;
  SaleRequestTemp: ModelSaleRequestTemp;
  SaleRequestTempId: number;
}

import { ModelSaleRequestTemp } from './model-saleRequestTemp';
import { ModelProduct } from './model-product';

export class ModelSaleRequestProductTemp {
  SaleRequestProductTempId: number;
  ProductPriceLookUpCode: string;
  ProductInternalCodeOnErp: number;
  Value: number;
  Quantity: number;
  TotalLiquid: number;
  Product: ModelProduct;
  SaleRequestTemp: ModelSaleRequestTemp;
  SaleRequestTempId: number;
  Comments: string;
  IsPrinted: boolean;
}

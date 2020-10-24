import { ModelProduct } from './model-product';
import { ModelSaleRequest } from './model-saleRequest';

export class ModelSaleRequestProduct {
    SaleRequestProductId: number;
    ProductPriceLookUpCode: string;
    Value: number;
    Quantity: number;
    Comments: string;
    UserId: number;
    DateHourOfCreation: string;
    IsCancelled: boolean;
    IsDelivered: boolean;
    ProductionStatus: number;
    TotalLiquid: number;
    ProductInternalCodeOnErp: number;
    SaleRequestId: number;
    Product: ModelProduct;
    SaleRequest: ModelSaleRequest;
}

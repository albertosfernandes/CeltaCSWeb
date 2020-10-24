import { ModelSaleRequestProduct } from './model-saleRequestProduct';

export class ModelSaleRequest {
    SaleRequestId: number;
    PersonalizedCode: string;
    DateOfCreation: string;
    DateHourOfCreation: string;
    EnterpriseId: number;
    IsCancelled: boolean;
    IsUsing: boolean;
    Peoples: number;
    FlagStatus: string;
    TotalLiquid: number;
    FlagOrigin: string;
    Products: ModelSaleRequestProduct[] = [];
}

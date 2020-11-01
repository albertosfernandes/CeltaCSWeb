import { ModelSaleRequestProduct } from './model-saleRequestProduct';

export class ModelSaleRequest {
    SaleRequestId: number;
    PersonalizedCode: string;
    DateOfCreation: Date;
    DateHourOfCreation: Date;
    EnterpriseId: number;
    IsCancelled: boolean;
    IsUsing: boolean;
    Peoples: number;
    FlagStatus: string;
    TotalLiquid: number;
    FlagOrigin: number;
    Products: ModelSaleRequestProduct[];
}

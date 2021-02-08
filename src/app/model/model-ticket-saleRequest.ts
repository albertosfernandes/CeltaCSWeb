import { ModelTicket } from './model-ticket';
import { ModelSaleRequest } from 'src/app/model/model-saleRequest';
export class ModelTicketSaleRequest {
  TicketAccessControlId: number;
  Ticket: ModelTicket;
  SaleRequestId: number;
  SaleRequest: ModelSaleRequest;
}

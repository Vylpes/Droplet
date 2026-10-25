import { SupplyStatus } from "../constants/Status/SupplyStatus";
import { BaseDto } from "./BaseDto";

export interface SupplyDto extends BaseDto {
    Name: string;
    Sku: string;
    UnusedQuantity: number;
    UsedQuantity: number;
    Status: SupplyStatus;
    StatusName: string;
    BuyPrice: number;
    PurchaseId?: string;
}

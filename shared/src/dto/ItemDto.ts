import { ItemStatus } from "../constants/Status/ItemStatus";
import { BaseDto } from "./BaseDto";

export interface ItemDto extends BaseDto {
    Name: string;
    Sku: string;
    UnlistedQuantity: number;
    ListedQuantity: number;
    SoldQuantity: number;
    RejectedQuantity: number;
    Status: ItemStatus;
    StatusName: string;
    BuyPrice: number;
    PurchaseId?: string;
    StorageId?: string;
}

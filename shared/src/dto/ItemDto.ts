import { ItemStatus } from "../constants/Status/ItemStatus";
import { BaseDto } from "./BaseDto";
import { StorageDto } from "./StorageDto";

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
    /** Nested bin → unit → building when loaded for item detail. */
    Storage?: StorageDto;
}

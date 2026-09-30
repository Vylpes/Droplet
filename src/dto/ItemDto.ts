import { ItemStatus } from "../constants/Status/ItemStatus";
import { Item } from "../database/entities/Item";
import { BaseDto, mapBase } from "./BaseDto";

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

export function mapItem(item: Item): ItemDto {
    return {
        ...mapBase(item),
        Name: item.Name,
        Sku: item.Sku,
        UnlistedQuantity: item.UnlistedQuantity,
        ListedQuantity: item.ListedQuantity,
        SoldQuantity: item.SoldQuantity,
        RejectedQuantity: item.RejectedQuantity,
        Status: item.Status,
        StatusName: item.StatusName() || "",
        BuyPrice: Number(item.BuyPrice),
        PurchaseId: item.Purchase?.Id,
        StorageId: item.Storage?.Id
    };
}

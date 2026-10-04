import type { ItemDto } from "@droplet/shared";
import { Item } from "../database/entities/Item";
import { mapBase } from "./BaseDto";

export type { ItemDto } from "@droplet/shared";

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

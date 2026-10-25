import type { ItemDto } from "@droplet/shared";
import { Item } from "../database/entities/Item";
import { mapBase } from "./BaseDto";
import { mapStorage } from "./StorageDto";

export type { ItemDto } from "@droplet/shared";

export function mapItem(item: Item, includeStorage: boolean = false): ItemDto {
    const dto: ItemDto = {
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

    if (includeStorage && item.Storage) {
        dto.Storage = mapStorage(item.Storage, false, false, true);
    }

    return dto;
}

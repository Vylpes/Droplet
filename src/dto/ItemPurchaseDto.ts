import type { ItemPurchaseDto } from "@droplet/shared";
import { ItemPurchase } from "../database/entities/ItemPurchase";
import { mapBase } from "./BaseDto";
import { mapItem } from "./ItemDto";

export type { ItemPurchaseDto } from "@droplet/shared";

export function mapItemPurchase(purchase: ItemPurchase, includeItems: boolean = false): ItemPurchaseDto {
    const dto: ItemPurchaseDto = {
        ...mapBase(purchase),
        Description: purchase.Description,
        Status: purchase.Status,
        StatusName: purchase.StatusName() || "",
        Price: Number(purchase.Price)
    };

    if (includeItems && purchase.Items) {
        dto.Items = purchase.Items.map(mapItem);
    }

    return dto;
}

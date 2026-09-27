import { ItemPurchaseStatus } from "../constants/Status/ItemPurchaseStatus";
import { ItemPurchase } from "../database/entities/ItemPurchase";
import { BaseDto, mapBase } from "./BaseDto";
import { ItemDto, mapItem } from "./ItemDto";

export interface ItemPurchaseDto extends BaseDto {
    Description: string;
    Status: ItemPurchaseStatus;
    StatusName: string;
    Price: number;
    Items?: ItemDto[];
}

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

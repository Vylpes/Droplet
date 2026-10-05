import type { SupplyPurchaseDto } from "@droplet/shared";
import { SupplyPurchase } from "../database/entities/SupplyPurchase";
import { mapBase } from "./BaseDto";
import { mapSupply } from "./SupplyDto";

export type { SupplyPurchaseDto } from "@droplet/shared";

export function mapSupplyPurchase(purchase: SupplyPurchase, includeSupplies: boolean = false): SupplyPurchaseDto {
    const dto: SupplyPurchaseDto = {
        ...mapBase(purchase),
        Description: purchase.Description,
        Status: purchase.Status,
        StatusName: purchase.StatusName() || "",
        Price: Number(purchase.Price)
    };

    if (includeSupplies && purchase.Supplies) {
        dto.Supplies = purchase.Supplies.map(mapSupply);
    }

    return dto;
}

import type { SupplyDto } from "@droplet/shared";
import { Supply } from "../database/entities/Supply";
import { mapBase } from "./BaseDto";

export type { SupplyDto } from "@droplet/shared";

export function mapSupply(supply: Supply): SupplyDto {
    return {
        ...mapBase(supply),
        Name: supply.Name,
        Sku: supply.Sku,
        UnusedQuantity: supply.UnusedQuantity,
        UsedQuantity: supply.UsedQuantity,
        Status: supply.Status,
        StatusName: supply.StatusName() || "",
        BuyPrice: Number(supply.BuyPrice),
        PurchaseId: supply.Purchase?.Id
    };
}

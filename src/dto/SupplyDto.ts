import { SupplyStatus } from "../constants/Status/SupplyStatus";
import { Supply } from "../database/entities/Supply";
import { BaseDto, mapBase } from "./BaseDto";

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

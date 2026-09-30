import { SupplyPurchaseStatus } from "../constants/Status/SupplyPurchaseStatus";
import { SupplyPurchase } from "../database/entities/SupplyPurchase";
import { BaseDto, mapBase } from "./BaseDto";
import { SupplyDto, mapSupply } from "./SupplyDto";

export interface SupplyPurchaseDto extends BaseDto {
    Description: string;
    Status: SupplyPurchaseStatus;
    StatusName: string;
    Price: number;
    Supplies?: SupplyDto[];
}

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

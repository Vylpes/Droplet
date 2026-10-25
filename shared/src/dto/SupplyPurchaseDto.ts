import { SupplyPurchaseStatus } from "../constants/Status/SupplyPurchaseStatus";
import { BaseDto } from "./BaseDto";
import { SupplyDto } from "./SupplyDto";

export interface SupplyPurchaseDto extends BaseDto {
    Description: string;
    Status: SupplyPurchaseStatus;
    StatusName: string;
    Price: number;
    Supplies?: SupplyDto[];
}

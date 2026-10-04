import { ItemPurchaseStatus } from "../constants/Status/ItemPurchaseStatus";
import { BaseDto } from "./BaseDto";
import { ItemDto } from "./ItemDto";

export interface ItemPurchaseDto extends BaseDto {
    Description: string;
    Status: ItemPurchaseStatus;
    StatusName: string;
    Price: number;
    Items?: ItemDto[];
}

import { StorageType } from "../constants/StorageType";
import { BaseDto } from "./BaseDto";
import { ItemDto } from "./ItemDto";

export interface StorageDto extends BaseDto {
    Name: string;
    SkuPrefix: string;
    StorageType: StorageType;
    StorageTypeName: string;
    ItemCounter: number;
    ParentId?: string;
    Children?: StorageDto[];
    Items?: ItemDto[];
}

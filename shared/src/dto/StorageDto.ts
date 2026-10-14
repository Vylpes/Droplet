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
    /** Present when mapped with parent hierarchy (e.g. item detail Storage). */
    Parent?: StorageDto;
    Children?: StorageDto[];
    Items?: ItemDto[];
}

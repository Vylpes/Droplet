import { StorageType } from "../constants/StorageType";
import { Storage } from "../database/entities/Storage";
import { BaseDto, mapBase } from "./BaseDto";
import { ItemDto, mapItem } from "./ItemDto";

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

export function mapStorage(storage: Storage, includeChildren: boolean = false, includeItems: boolean = false): StorageDto {
    const dto: StorageDto = {
        ...mapBase(storage),
        Name: storage.Name,
        SkuPrefix: storage.SkuPrefix,
        StorageType: storage.StorageType,
        StorageTypeName: storage.StorageTypeName() || "",
        ItemCounter: storage.ItemCounter,
        ParentId: storage.Parent?.Id
    };

    if (includeChildren && storage.Children) {
        dto.Children = storage.Children.map(c => mapStorage(c));
    }

    if (includeItems && storage.Items) {
        dto.Items = storage.Items.map(mapItem);
    }

    return dto;
}

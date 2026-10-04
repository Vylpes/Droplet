import type { StorageDto } from "@droplet/shared";
import { Storage } from "../database/entities/Storage";
import { mapBase } from "./BaseDto";
import { mapItem } from "./ItemDto";

export type { StorageDto } from "@droplet/shared";

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

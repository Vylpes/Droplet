import { v4 } from "uuid";
import { StorageType } from "../../../constants/StorageType";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Storage from "../../models/Storage/Storage";

export default async function CreateStorageUnitCommand(buildingId: string, name: string, skuPrefix: string): Promise<Storage> {
    const buildingMaybe = await ConnectionHelper.FindOne<Storage>("storage", { uuid: buildingId, storageType: StorageType.Building });

    if (!buildingMaybe.IsSuccess) {
        return;
    }

    const unit: Storage = {
        uuid: v4(),
        name,
        skuPrefix,
        storageType: StorageType.Unit,
        itemCounter: 0,
        r_children: [],
    };

    await ConnectionHelper.InsertOne<Storage>("storage", unit);
    await ConnectionHelper.UpdateOne<Storage>("storage", { uuid: buildingId, storageType: StorageType.Building }, { $push: { r_children: unit.uuid }});

    return unit;
}
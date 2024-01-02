import { v4 } from "uuid";
import { StorageType } from "../../../constants/StorageType";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Storage from "../../models/Storage/Storage";

export default async function CreateStorageBinCommand(unitId: string, name: string, skuPrefix: string): Promise<Storage> {
    const unitMaybe = await ConnectionHelper.FindOne<Storage>("storage", { uuid: unitId, storageType: StorageType.Unit });

    if (!unitMaybe.IsSuccess) {
        return;
    }

    const buildingMaybe = await ConnectionHelper.FindOne<Storage>("storage", { storageType: StorageType.Building, r_children: unitId });

    if (!buildingMaybe.IsSuccess) {
        return;
    }

    const building = buildingMaybe.Value;
    const unit = unitMaybe.Value;

    const bin: Storage = {
        uuid: v4(),
        name,
        skuPrefix: `${building.skuPrefix}${unit.skuPrefix}${skuPrefix}`,
        storageType: StorageType.Bin,
        itemCounter: 0,
        r_children: [],
    };

    await ConnectionHelper.InsertOne<Storage>("storage", bin);
    await ConnectionHelper.UpdateOne<Storage>("storage", { uuid: unitId, storageType: StorageType.Unit }, { $push: { r_children: bin.uuid }});

    return bin;
}
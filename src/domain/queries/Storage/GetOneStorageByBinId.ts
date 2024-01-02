import { StorageType } from "../../../constants/StorageType";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Storage from "../../models/Storage/Storage";

export default async function GetOneStorageByBinId(uuid: string): Promise<{bin: Storage, unit: Storage, building: Storage}> {
    const bin = await ConnectionHelper.FindOne<Storage>("storage", { uuid, storageType: StorageType.Bin });

    if (!bin.IsSuccess) {
        return Promise.reject("Unable to find storage");
    }

    const unit = await ConnectionHelper.FindOne<Storage>("storage", { r_children: uuid, storageType: StorageType.Unit });
    const building = await ConnectionHelper.FindOne<Storage>("storage", { r_children: unit.Value.uuid, storageType: StorageType.Building });

    return {
        bin: bin.Value,
        unit: unit.Value,
        building: building.Value,
    };
}
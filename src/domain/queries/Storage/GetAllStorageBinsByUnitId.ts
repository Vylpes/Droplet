import { StorageType } from "../../../constants/StorageType";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Storage from "../../models/Storage/Storage";

export default async function GetAllStorageBinsByUnitId(unitId: string): Promise<Storage[]> {
    const unitMaybe = await ConnectionHelper.FindOne<Storage>("storage", { uuid: unitId, storageType: StorageType.Unit });

    if (!unitMaybe.IsSuccess) {
        return;
    }

    const unit = unitMaybe.Value;

    const binsMaybe = await ConnectionHelper.FindMultiple<Storage>("storage", { storageType: StorageType.Bin, uuid: { $in: unit.r_children } });

    if (!binsMaybe.IsSuccess) {
        return;
    }

    const bins = binsMaybe.Value;

    return bins;
}
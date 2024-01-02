import { StorageType } from "../../../constants/StorageType";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Storage from "../../models/Storage/Storage";

export default async function GetAllStorageUnitsByBuildingId(buildingId: string): Promise<Storage[]> {
    const buildingMaybe = await ConnectionHelper.FindOne<Storage>("storage", { uuid: buildingId, storageType: StorageType.Building });

    if (!buildingMaybe.IsSuccess) {
        return;
    }

    const building = buildingMaybe.Value;

    const unitsMaybe = await ConnectionHelper.FindMultiple<Storage>("storage", { storageType: StorageType.Unit, uuid: { $in: building.r_children } });

    if (!unitsMaybe.IsSuccess) {
        return;
    }

    const units = unitsMaybe.Value;

    return units;
}
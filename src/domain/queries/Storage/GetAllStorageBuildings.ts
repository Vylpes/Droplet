import { StorageType } from "../../../constants/StorageType";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Storage from "../../models/Storage/Storage";

export default async function GetAllStorageBuildings(): Promise<Storage[]> {
    const buildingMaybe = await ConnectionHelper.FindMultiple<Storage>("storage", { storageType: StorageType.Building });

    if (!buildingMaybe.IsSuccess) {
        return;
    }

    const building = buildingMaybe.Value;

    return building;
}
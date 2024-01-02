import { StorageType } from "../../../constants/StorageType";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Storage from "../../models/Storage/Storage";

export default async function GetAllStoragesByType(storageType: StorageType): Promise<Storage[]> {
    const storages = await ConnectionHelper.FindMultiple<Storage>("storage", { storageType });

    if (!storages.IsSuccess) {
        return;
    }

    await storages.Value;
}
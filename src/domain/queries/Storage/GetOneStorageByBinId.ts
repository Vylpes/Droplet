import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Storage from "../../models/Storage/Storage";

export default async function GetOneStorageByBinId(binId: string): Promise<Storage> {
    const storage = await ConnectionHelper.FindOne<Storage>("item", { units: { bins: { uuid: binId } } });

    if (!storage.IsSuccess) {
        return Promise.reject("Unable to find storage");
    }

    return storage.Value;
}
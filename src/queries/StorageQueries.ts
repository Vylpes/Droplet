import ConnectionHelper from "../helpers/ConnectionHelper";
import StorageEntity from "./entities/StorageEntity";

export default class StorageQueries {
    public static async GetOneByBinId(binId: string) {
        const storage = await ConnectionHelper.FindOne<StorageEntity>("item", { units: { bins: { uuid: binId } } });

        if (!storage.IsSuccess) {
            return Promise.reject("Unable to find storage");
        }

        return storage.Value;
    }
}
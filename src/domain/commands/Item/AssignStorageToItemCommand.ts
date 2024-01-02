import { StorageType } from "../../../constants/StorageType";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Item from "../../models/Item/Item";
import Storage from "../../models/Storage/Storage";

export default async function AssignStorageToItemCommand(itemId: string, binId: string) {
    const itemMaybe = await ConnectionHelper.FindOne<Item>("item", { uuid: itemId });
    const binMaybe = await ConnectionHelper.FindOne<Storage>("storage", { uuid: binId, storageType: StorageType.Bin });

    if (!itemMaybe.IsSuccess || !binMaybe.IsSuccess) {
        return;
    }

    const bin = binMaybe.Value;

    const itemCounterString = String(bin.itemCounter);

    const sku = `${bin.skuPrefix}-${itemCounterString.padStart(4, '0')}`;

    await ConnectionHelper.UpdateOne<Item>("item", { uuid: itemId }, { $set: { sku, r_storageBin: binId } });
    await ConnectionHelper.UpdateOne<Storage>("storage", { uuid: binId, storageType: StorageType.Bin }, { $set: { itemCounter: bin.itemCounter + 1 } });
}
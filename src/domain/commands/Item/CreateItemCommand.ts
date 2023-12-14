import { v4 } from "uuid";
import Item from "../../models/Item/Item";
import { ItemStatus } from "../../../constants/Status/ItemStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";

export default async function CreateItem(name: string, quantity: number, purchaseId: string) {
    const item: Item = {
        uuid: v4(),
        sku: null,
        name: name,
        quantities: {
            unlisted: quantity,
            listed: 0,
            sold: 0,
            rejected: 0,
        },
        status: ItemStatus.Unlisted,
        notes: [],
        r_storageBin: null,
        r_itemPurchase: purchaseId,
    };

    await ConnectionHelper.InsertOne<Item>("item", item);
}
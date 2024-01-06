import { v4 } from "uuid";
import Item from "../../models/Item/Item";
import { ItemStatus } from "../../../constants/Status/ItemStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import ItemPurchase from "../../models/ItemPurchase/ItemPurchase";

export default async function CreateItem(name: string, quantity: number, purchaseId: string) {
    const item: Item = {
        uuid: v4(),
        sku: null,
        name: name,
        quantities: {
            unlisted: Number(quantity),
            listed: Number(0),
            sold: Number(0),
            rejected: Number(0),
        },
        status: ItemStatus.Unlisted,
        notes: [],
        r_storageBin: null,
        r_itemPurchase: purchaseId,
    };

    await ConnectionHelper.InsertOne<Item>("item", item);
    await ConnectionHelper.UpdateOne<ItemPurchase>("item-purchase", { uuid: purchaseId }, { $push: { r_items: item.uuid } });
}
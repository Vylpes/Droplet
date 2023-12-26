import { v4 } from "uuid";
import ItemPurchase from "../../models/ItemPurchase/ItemPurchase";
import { ItemPurchaseStatus } from "../../../constants/Status/ItemPurchaseStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";

export default async function CreateItemPurchaseCommand(description: string, price: number) {
    const itemPurchase: ItemPurchase = {
        uuid: v4(),
        description,
        price,
        status: ItemPurchaseStatus.Ordered,
        notes: [],
        r_items: [],
    };

    await ConnectionHelper.InsertOne<ItemPurchase>("item-purchase", itemPurchase);
}
import { ItemPurchaseStatus } from "../../../constants/Status/ItemPurchaseStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import ItemPurchase from "../../models/ItemPurchase/ItemPurchase";

export default async function UpdateItemPurchaseStatusCommand(itemPurchaseId: string, status: ItemPurchaseStatus) {
    const itemPurchase = await ConnectionHelper.FindOne<ItemPurchase>("item-purchase", { uuid: itemPurchaseId });

    if (!itemPurchase) {
        return;
    }

    await ConnectionHelper.UpdateOne<ItemPurchase>("item-purchase", { uuid: itemPurchaseId }, { $set: { status }});
}
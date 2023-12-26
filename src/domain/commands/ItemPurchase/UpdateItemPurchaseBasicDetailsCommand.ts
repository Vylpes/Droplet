import ConnectionHelper from "../../../helpers/ConnectionHelper";
import ItemPurchase from "../../models/ItemPurchase/ItemPurchase";

export default async function UpdateItemPurchaseBasicDetailsCommand(itemPurchaseId: string, description: string, price: number) {
    const itemPurchase = await ConnectionHelper.FindOne<ItemPurchase>("item-purchase", { uuid: itemPurchaseId });

    if (!itemPurchase) {
        return;
    }

    await ConnectionHelper.UpdateOne<ItemPurchase>("item-purchase", { uuid: itemPurchaseId }, { $set: { description, price }});
}
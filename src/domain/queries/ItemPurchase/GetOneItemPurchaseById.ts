import ConnectionHelper from "../../../helpers/ConnectionHelper";
import ItemPurchase from "../../models/ItemPurchase/ItemPurchase";

export default async function GetOneItemPurchaseById(itemPurchaseId: string): Promise<ItemPurchase> {
    const itemPurchase = await ConnectionHelper.FindOne<ItemPurchase>("item-purchase", { uuid: itemPurchaseId });

    if (!itemPurchase.IsSuccess) {
        return Promise.reject("Unable to find item purchase");
    }

    return itemPurchase.Value;
}
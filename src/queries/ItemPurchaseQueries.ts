import ConnectionHelper from "../helpers/ConnectionHelper";
import ItemPurchaseEntity from "./entities/ItemPurchaseEntity";

export default class ItemPurchaseQueries {
    public static async GetOneById(itemPurchaseId: string): Promise<ItemPurchaseEntity> {
        const itemPurchase = await ConnectionHelper.FindOne<ItemPurchaseEntity>("item-purchase", { uuid: itemPurchaseId });

        if (!itemPurchase.IsSuccess) {
            return Promise.reject("Unable to find item purchase");
        }

        return itemPurchase.Value;
    }
}
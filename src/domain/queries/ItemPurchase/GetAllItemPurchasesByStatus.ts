import { ItemPurchaseStatus } from "../../../constants/Status/ItemPurchaseStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import ItemPurchase from "../../models/ItemPurchase/ItemPurchase";

export default async function GetAllItemPurchasesByStatus(status: ItemPurchaseStatus): Promise<ItemPurchase[]> {
    const itemPurchases = await ConnectionHelper.FindMultiple<ItemPurchase>("item-purchase", { status });

    if (!itemPurchases.IsSuccess) {
        return Promise.reject("Unable to find item purchases");
    }

    return itemPurchases.Value;
}
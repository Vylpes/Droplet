import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Item from "../../models/Item/Item";
import GetOneItemPurchaseById from "../ItemPurchase/GetOneItemPurchaseById";

export default async function GetAllItemsAssignedByPurchaseId(itemPurchaseId: string): Promise<Item[]> {
    const itemPurchase = await GetOneItemPurchaseById(itemPurchaseId);

    if (!itemPurchase) {
        return;
    }

    const items = await ConnectionHelper.FindMultiple<Item>("item", { uuid: { $in: itemPurchase.r_items } });

    if (!items.IsSuccess) {
        return;
    }

    return items.Value;
}
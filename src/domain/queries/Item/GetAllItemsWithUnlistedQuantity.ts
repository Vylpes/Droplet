import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Item from "../../models/Item/Item";

export default async function GetAllItemsWithUnlistedQuantity(): Promise<Item[]> {
    const items = await ConnectionHelper.FindMultiple<Item>("item", { quantities: { unlisted: { $gt: 0 } } });

    if (!items.IsSuccess) {
        return;
    }

    return items.Value;
}
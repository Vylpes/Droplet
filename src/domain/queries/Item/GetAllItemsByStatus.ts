import { ItemStatus } from "../../../constants/Status/ItemStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Item from "../../models/Item/Item";

export default async function GetAllItemsByStatus(status: ItemStatus): Promise<Item[]> {
    const itemsMaybe = await ConnectionHelper.FindMultiple<Item>("item", { status });

    if (!itemsMaybe.IsSuccess) {
        return;
    }

    const items = itemsMaybe.Value;

    return items;
}
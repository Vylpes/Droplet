import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Item from "../../models/Item/Item";

export default async function GetAllItemsNotAssignedToStorage(): Promise<Item[]> {
    const itemsMaybe = await ConnectionHelper.FindMultiple<Item>("item", { r_storageBin: null });

    if (!itemsMaybe.IsSuccess) {
        return;
    }

    const items = itemsMaybe.Value;

    return items;
}
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Item from "../../models/Item/Item";

export default async function GetOneItemById(itemId: string): Promise<Item> {
    const itemMaybe = await ConnectionHelper.FindOne<Item>("item", { uuid: itemId });

    if (!itemMaybe.IsSuccess) {
        return Promise.reject("Unable to find item");
    }

    return itemMaybe.Value;
}
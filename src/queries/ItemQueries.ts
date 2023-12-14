import ConnectionHelper from "../helpers/ConnectionHelper";
import ItemEntity from "./entities/ItemEntity";

export default class ItemQueries {
    public static async GetOneById(itemId: string): Promise<ItemEntity> {
        const itemMaybe = await ConnectionHelper.FindOne<ItemEntity>("item", { uuid: itemId });

        if (!itemMaybe.IsSuccess) {
            return Promise.reject("Unable to find item");
        }

        return itemMaybe.Value;
    }
}
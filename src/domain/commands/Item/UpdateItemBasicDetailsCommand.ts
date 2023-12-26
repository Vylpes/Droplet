import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Item from "../../models/Item/Item";

export default async function UpdateItemBasicDetailsCommand(itemId: string, name: string) {
    const item = await ConnectionHelper.FindOne<Item>("item", { uuid: itemId });

    if (!item) {
        return;
    }

    await ConnectionHelper.UpdateOne<Item>("item", { uuid: itemId }, { $set: { name } });
}
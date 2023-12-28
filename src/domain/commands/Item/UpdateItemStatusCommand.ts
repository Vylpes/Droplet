import { ItemStatus } from "../../../constants/Status/ItemStatus";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Item from "../../models/Item/Item";

export default async function UpdateItemStatusCommand(uuid: string, status: ItemStatus) {
    const itemMaybe = await ConnectionHelper.FindOne<Item>("item", { uuid });

    if (!itemMaybe.IsSuccess) {
        return;
    }

    await ConnectionHelper.UpdateOne<Item>("item", { uuid }, { $set: { status } });
}
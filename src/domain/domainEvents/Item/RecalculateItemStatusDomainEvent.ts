import ConnectionHelper from "../../../helpers/ConnectionHelper";
import UpdateItemStatusCommand from "../../commands/Item/UpdateItemStatusCommand";
import UpdateItemPurchaseStatusCommand from "../../commands/ItemPurchase/UpdateItemPurchaseStatusCommand";
import Item, { CalculateStatus as CalculateItemStatus } from "../../models/Item/Item";

export default async function RecalculateItemStatusDomainEvent(uuid: string) {
    const item = await ConnectionHelper.FindOne<Item>("item", { uuid });

    if (!item.IsSuccess) {
        return;
    }

    await UpdateItemStatusCommand(uuid, CalculateItemStatus(item.Value));
}
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import RecalculateItemStatusDomainEvent from "../../domainEvents/Item/RecalculateItemStatusDomainEvent";
import Item from "../../models/Item/Item";

export default async function UpdateItemQuantityCommand(itemId: string, unlisted: number, listed: number, sold: number, rejected: number) {
    const item = await ConnectionHelper.FindOne<Item>("item", { uuid: itemId });

    if (!item) {
        return;
    }

    await ConnectionHelper.UpdateOne<Item>("item", { uuid: itemId }, { $set: { quantities: { unlisted: Number(unlisted), listed: Number(listed), sold: Number(sold), rejected: Number(rejected) } } });

    await RecalculateItemStatusDomainEvent(itemId);
}
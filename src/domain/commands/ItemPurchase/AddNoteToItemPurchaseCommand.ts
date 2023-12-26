import { v4 } from "uuid";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import { Note } from "../../models/ItemPurchase/Note";
import ItemPurchase from "../../models/ItemPurchase/ItemPurchase";

export default async function AddNoteToItemPurchaseCommand(itemPurchaseId: string, comment: string, userId: string, username: string) {
    const itemPurchase = await ConnectionHelper.FindOne<ItemPurchase>("item-purchase", { uuid: itemPurchaseId });

    if (!itemPurchase) {
        return;
    }

    const note: Note = {
        uuid: v4(),
        comment,
        author: {
            r_userId: userId,
            username,
        },
        whenCreated: new Date(),
    };

    await ConnectionHelper.UpdateOne<ItemPurchase>("item-purchase", { uuid: itemPurchaseId}, { $push: { notes: note } });
}
import { v4 } from "uuid";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Item from "../../models/Item/Item";
import { Note } from "../../models/Item/Note";

export default async function AddNoteToItem(itemId: string, comment: string, userId: string, username: string) {
    const item = await ConnectionHelper.FindOne<Item>("item", { uuid: itemId });

    if (!item) {
        return;
    }

    const note: Note = {
        uuid: v4(),
        comment,
        author: {
            r_userId: userId,
            username
        },
        whenCreated: new Date(),
    };

    await ConnectionHelper.UpdateOne<Item>("item", { uuid: itemId }, { $push: { notes: note }});
}
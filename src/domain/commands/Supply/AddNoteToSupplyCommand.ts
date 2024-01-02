import { v4 } from "uuid";
import { Note } from "../../models/Supply/Note";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Supply from "../../models/Supply/Supply";

export default async function AddNoteToSupplyCommand(uuid: string, comment: string, userId: string, username: string) {
    const supplyMaybe = await ConnectionHelper.FindOne<Supply>("supply", { uuid });

    if (!supplyMaybe.IsSuccess) {
        return;
    }

    const note: Note = {
        uuid: v4(),
        comment,
        whenCreated: new Date(),
        author: {
            username,
            r_userId: userId,
        },
    };

    await ConnectionHelper.UpdateOne<Supply>("supply", { uuid }, { $push: { notes: note }});
}
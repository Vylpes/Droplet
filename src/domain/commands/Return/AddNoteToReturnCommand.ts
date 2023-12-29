import { v4 } from "uuid";
import ConnectionHelper from "../../../helpers/ConnectionHelper"
import { Note } from "../../models/Return/Note";
import Return from "../../models/Return/Return"

export default async function AddNoteToReturnCommand(uuid: string, comment: string, userId: string, username: string) {
    const returnMaybe = await ConnectionHelper.FindOne<Return>("return", { uuid });

    if (!returnMaybe.IsSuccess) {
        return;
    }

    const note: Note = {
        uuid: v4(),
        comment,
        whenCreated: new Date(),
        author: {
            username,
            r_userId: userId,
        }
    };

    await ConnectionHelper.UpdateOne<Return>("return", { uuid }, { $push: { notes: note } });
}
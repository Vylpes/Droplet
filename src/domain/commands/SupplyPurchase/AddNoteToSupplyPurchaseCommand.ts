import { v4 } from "uuid";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import { Note } from "../../models/SupplyPurchase/Note";
import SupplyPurchase from "../../models/SupplyPurchase/SupplyPurchase";

export default async function AddNoteToSupplyPurchaseCommand(uuid: string, comment: string, userId: string, username: string) {
    const supplyMaybe = await ConnectionHelper.FindOne<SupplyPurchase>("supply-purchase", { uuid });

    if (!supplyMaybe.IsSuccess) {
        return;
    }

    const note: Note = {
        uuid: v4(),
        comment,
        whenCreated: new Date(),
        author: {
            r_userId: userId,
            username,
        },
    };

    await ConnectionHelper.UpdateOne<SupplyPurchase>("supply-purchase", { uuid }, { $push: { notes: note } });
}
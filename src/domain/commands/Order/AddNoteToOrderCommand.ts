import { v4 } from "uuid";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import { Note } from "../../models/Order/Note";
import Order from "../../models/Order/Order";

export default async function AddNoteToOrderCommand(orderId: string, comment: string, userId: string, username: string) {
    const orderMaybe = await ConnectionHelper.FindOne<Order>("order", { uuid: orderId });

    if (!orderMaybe.IsSuccess) {
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

    await ConnectionHelper.UpdateOne<Order>("order", { uuid: orderId }, { $push: { notes: note } });
}
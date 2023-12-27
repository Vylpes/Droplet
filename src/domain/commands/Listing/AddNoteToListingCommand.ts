import { v4 } from "uuid";
import ConnectionHelper from "../../../helpers/ConnectionHelper";
import Listing from "../../models/Listing/Listing";
import { Note } from "../../models/Listing/Note";

export default async function AddNoteToListingCommand(listingId: string, comment: string, userId: string, username: string) {
    const listing = await ConnectionHelper.FindOne<Listing>("listing", { uuid: listingId });

    if (!listing) {
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

    await ConnectionHelper.UpdateOne<Listing>("listing", { uuid: listingId }, { $push: { notes: note } });
}
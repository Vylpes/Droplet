import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import Page from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import Note from "../../database/entities/Note";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const itemId = req.params.itemId;

        if (!itemId) {
            next(createHttpError(404));
            return;
        }

        const item = await Item.FetchOneById<Item>(Item, itemId, [
            "Purchase",
            "Storage",
            "Storage.Parent",
            "Storage.Parent.Parent"
        ]);

        if (!item) {
            next(createHttpError(404));
            return;
        }

        const notes = await Note.FetchAllForId(NoteType.Item, itemId);

        res.locals.item = item;
        res.locals.notes = notes.sort((a, b) => a.WhenCreated < b.WhenCreated ? -1 : a.WhenCreated > b.WhenCreated ? 1 : 0);

        res.render('items/view', res.locals.viewData);
    }
}
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import Note from "../../entity/Note";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class view extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:itemId', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const itemId = req.params.itemId;

            if (!itemId) {
                next(createHttpError(404));
            }

            const item = await Item.FetchOneById<Item>(Item, itemId, [
                "Purchase",
                "Storage",
                "Storage.Parent",
                "Storage.Parent.Parent"
            ]);
            
            if (!item) {
                next(createHttpError(404));
            }
            
            const notes = await Note.FetchAllForId(NoteType.Item, itemId);

            res.locals.item = item;
            res.locals.notes = notes.sort((a, b) => a.WhenCreated < b.WhenCreated ? -1 : a.WhenCreated > b.WhenCreated ? 1 : 0);

            res.render('items/view', res.locals.viewData);
        });
    }
}
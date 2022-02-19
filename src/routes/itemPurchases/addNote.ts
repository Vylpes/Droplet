import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import Note from "../../entity/Note";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class AddNote extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/:Id/add-note', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }

            const text = req.body.text;

            const note = new Note(text, NoteType.ItemPurchase, Id);

            await note.Save(Note, note);

            res.redirect(`/item-purchases/view/${Id}`);
        });
    }
}
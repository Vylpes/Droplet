import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import Note from "../../database/entities/Note";
import { Supply } from "../../database/entities/Supply";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class view extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:Id', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }

            const supply = await Supply.FetchOneById<Supply>(Supply, Id, [
                "Purchase"
            ]);

            if (!supply) {
                next(createHttpError(404));
            }

            const notes = await Note.FetchAllForId(NoteType.Supply, Id);

            res.locals.item = supply;
            res.locals.notes = notes;

            res.render('supplies/view', res.locals.viewData);
        });
    }
}
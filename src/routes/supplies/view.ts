import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import Page from "../../contracts/Page";
import Note from "../../database/entities/Note";
import { Supply } from "../../database/entities/Supply";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
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
    }
}
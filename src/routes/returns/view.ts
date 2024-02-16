import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import Page from "../../contracts/Page";
import Note from "../../database/entities/Note";
import { Return } from "../../database/entities/Return";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const Id = req.params.Id;

        if (!Id) {
            next(createHttpError(404));
        }

        const ret = await Return.FetchOneById(Return, Id, [
            "TrackingNumbers",
            "Order"
        ]);

        if (!ret) {
            next(createHttpError(404));
        }

        const notes = await Note.FetchAllForId(NoteType.Return, Id);

        res.locals.viewData.ret = ret;
        res.locals.viewData.notes = notes;

        res.render('returns/view', res.locals.viewData);
    }
}
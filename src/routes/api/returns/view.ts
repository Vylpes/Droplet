import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../../constants/NoteType";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import Note from "../../../database/entities/Note";
import { Return } from "../../../database/entities/Return";
import { mapNote, mapReturn } from "../../../dto";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const Id = (req.params.Id as string);

        if (!Id) {
            next(createHttpError(404));
            return;
        }

        const ret = await Return.FetchOneById(Return, Id, {
            TrackingNumbers: true,
            Order: true
        });

        if (!ret) {
            next(createHttpError(404));
            return;
        }

        const notes = await Note.FetchAllForId(NoteType.Return, Id);

        res.json(GenerateResponse(true, undefined, {
            Return: mapReturn(ret, true),
            Notes: notes.map(mapNote)
        }));
    }
}

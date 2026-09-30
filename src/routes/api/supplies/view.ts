import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../../constants/NoteType";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import Note from "../../../database/entities/Note";
import { Supply } from "../../../database/entities/Supply";
import { mapNote, mapSupply } from "../../../dto";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const Id = (req.params.Id as string);

        if (!Id) {
            next(createHttpError(404));
            return;
        }

        const supply = await Supply.FetchOneById<Supply>(Supply, Id, {
            Purchase: true
        });

        if (!supply) {
            next(createHttpError(404));
            return;
        }

        const notes = await Note.FetchAllForId(NoteType.Supply, Id);

        res.json(GenerateResponse(true, undefined, {
            Supply: mapSupply(supply),
            Notes: notes.map(mapNote)
        }));
    }
}

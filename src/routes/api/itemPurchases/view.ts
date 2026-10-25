import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../../constants/NoteType";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { ItemPurchase } from "../../../database/entities/ItemPurchase";
import Note from "../../../database/entities/Note";
import { mapItemPurchase, mapNote } from "../../../dto";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const Id = (req.params.Id as string);

        if (!Id) {
            next(createHttpError(404));
            return;
        }

        const purchase = await ItemPurchase.FetchOneById(ItemPurchase, Id, {
            Items: true
        });

        if (!purchase) {
            next(createHttpError(404));
            return;
        }

        const notes = await Note.FetchAllForId(NoteType.ItemPurchase, Id);

        res.json(GenerateResponse(true, undefined, {
            Purchase: mapItemPurchase(purchase, true),
            Notes: notes
                .sort((a, b) => a.WhenCreated < b.WhenCreated ? -1 : a.WhenCreated > b.WhenCreated ? 1 : 0)
                .map(mapNote)
        }));
    }
}

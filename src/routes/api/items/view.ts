import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../../constants/NoteType";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Item } from "../../../database/entities/Item";
import Note from "../../../database/entities/Note";
import { mapItem, mapNote } from "../../../dto";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const itemId = (req.params.itemId as string);

        if (!itemId) {
            next(createHttpError(404));
            return;
        }

        const item = await Item.FetchOneById<Item>(Item, itemId, {
            Purchase: true,
            Storage: {
                Parent: {
                    Parent: true
                }
            }
        });

        if (!item) {
            next(createHttpError(404));
            return;
        }

        const notes = await Note.FetchAllForId(NoteType.Item, itemId);

        res.json(GenerateResponse(true, undefined, {
            Item: mapItem(item),
            Notes: notes
                .sort((a, b) => a.WhenCreated < b.WhenCreated ? -1 : a.WhenCreated > b.WhenCreated ? 1 : 0)
                .map(mapNote)
        }));
    }
}

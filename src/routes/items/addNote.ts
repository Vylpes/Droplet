import { Request, Response } from "express";
import { NoteType } from "../../constants/NoteType";
import Page from "../../contracts/Page";
import Note from "../../database/entities/Note";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class AddNote implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("text")
                .NotEmpty();

        const itemId = req.params.itemId;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/items/${itemId}`);
            return;
        }

        const text = req.body.text;

        const note = new Note(text, NoteType.Item, itemId);

        await note.Save(Note, note);

        res.redirect(`/items/${itemId}`);
    }
}
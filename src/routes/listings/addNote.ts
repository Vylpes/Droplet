import { Request, Response } from "express";
import { NoteType } from "../../constants/NoteType";
import Page from "../../contracts/Page";
import Note from "../../database/entities/Note";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class AddNote implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("text")
                .NotEmpty();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/listings/view/${Id}`);
            return;
        }

        const text = req.body.text;

        const note = new Note(text, NoteType.Listing, Id);

        await note.Save(Note, note);

        res.redirect(`/listings/view/${Id}`);
    }
}
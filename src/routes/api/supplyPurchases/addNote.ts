import { NextFunction, Request, Response } from "express";
import { NoteType } from "../../../constants/NoteType";
import Page from "../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../contracts/IBasicResponse";
import Note from "../../../database/entities/Note";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapNote } from "../../../dto";

export default class AddNote implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("text")
                .NotEmpty();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const text = req.body.text;

        const note = new Note(text, NoteType.SupplyPurchase, Id);

        await note.Save(Note, note);

        res.json(GenerateResponse(true, "Note added", mapNote(note)));
    }
}

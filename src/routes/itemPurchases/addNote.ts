import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import Note from "../../entity/Note";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class AddNote extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("text")
                .NotEmpty();

        super.router.post('/:Id/add-note', bodyValidation.Validate.bind(bodyValidation), UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/item-purchases/view/${Id}`);
                return;
            }

            const text = req.body.text;

            const note = new Note(text, NoteType.ItemPurchase, Id);

            await note.Save(Note, note);

            res.redirect(`/item-purchases/view/${Id}`);
        });
    }
}

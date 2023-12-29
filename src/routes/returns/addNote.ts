import { NextFunction, Request, Response, Router } from "express";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import Note from "../../database/entities/Note";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import AddNoteToReturnCommand from "../../domain/commands/Return/AddNoteToReturnCommand";

export default class AddNote extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("text")
                .NotEmpty();

        super.router.post('/:Id/add-note', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/returns/view/${Id}`);
                return;
            }

            const text = req.body.text;
            
            await AddNoteToReturnCommand(Id, text, req.session.User.userId, req.session.User.username);

            res.redirect(`/returns/view/${Id}`);
        });
    }
}
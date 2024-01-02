import { NextFunction, Request, Response, Router } from "express";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { v4 } from "uuid";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import AddNoteToOrderCommand from "../../domain/commands/Order/AddNoteToOrderCommand";

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
                res.redirect(`/orders/view/${Id}`);
                return;
            }

            const text = req.body.text;

            await AddNoteToOrderCommand(Id, text, req.session.User.uuid, req.session.User.username);

            res.redirect(`/orders/view/${Id}`);
        });
    }
}
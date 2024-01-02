import { NextFunction, Request, Response, Router } from "express";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { v4 } from "uuid";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import AddNoteToItemCommand from "../../domain/commands/Item/AddNoteToItemCommand";

export default class AddNote extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("text")
                .NotEmpty();

        super.router.post('/:itemId/add-note', bodyValidation.Validate.bind(bodyValidation), UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const itemId = req.params.itemId;

            if (req.session.error) {
                res.redirect(`/items/${itemId}`);
                return;
            }

            const text = req.body.text;

            await AddNoteToItemCommand(itemId, text, req.session.User.uuid, req.session.User.username);

            res.redirect(`/items/${itemId}`);
        });
    }
}
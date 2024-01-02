import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { v4 } from "uuid";
import Body from "../../helpers/Validation/Body";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import AddNoteToItemPurchaseCommand from "../../domain/commands/ItemPurchase/AddNoteToItemPurchaseCommand";

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

            await AddNoteToItemPurchaseCommand(Id, text, req.session.User.uuid, req.session.User.username);

            res.redirect(`/item-purchases/view/${Id}`);
        });
    }
}

import { NextFunction, Request, Response, Router } from "express";
import { NoteType } from "../../constants/NoteType";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { Note } from "../../contracts/entities/ItemPurchase/Note";
import { v4 } from "uuid";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import ItemPurchase from "../../contracts/entities/ItemPurchase/ItemPurchase";

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

            const note: Note = {
                uuid: v4(),
                comment: text,
                whenCreated: new Date(),
                author: {
                    username: req.session.User.username,
                    r_userId: req.session.User.uuid,
                },
            }

            await ConnectionHelper.UpdateOne<ItemPurchase>("item-purchase", { items: { uuid: itemId } }, { $push: { 'items.$.notes': note } });

            res.redirect(`/items/${itemId}`);
        });
    }
}
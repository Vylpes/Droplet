import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { INote } from "../../contracts/entities/ItemPurchase/INote";
import { v4 } from "uuid";
import Body from "../../helpers/Validation/Body";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import ItemPurchase from "../../contracts/entities/ItemPurchase/ItemPurchase";

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

            const note: INote = {
                uuid: v4(),
                comment: text,
                whenCreated: new Date(),
                author: {
                    r_userId: req.session.User.uuid,
                    username: req.session.User.username,
                },
            };

            await ConnectionHelper.UpdateOne<ItemPurchase>("item-purchase", { uuid: Id }, { $push: { notes: note } });

            res.redirect(`/item-purchases/view/${Id}`);
        });
    }
}

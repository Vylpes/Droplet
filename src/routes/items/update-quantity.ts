import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import ItemPurchase from "../../contracts/entities/ItemPurchase/ItemPurchase";

export default class UpdateQuantity extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("unlisted")
                .NotEmpty()
                .Number()
            .ChangeField("listed")
                .NotEmpty()
                .Number()
            .ChangeField("sold")
                .NotEmpty()
                .Number()
            .ChangeField("rejected")
                .NotEmpty()
                .Number();

        super.router.post('/:itemId/update-quantity', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const itemId = req.params.itemId;

            if (req.session.error) {
                res.redirect(`/items/${itemId}`);
                return;
            }

            const unlisted = req.body.unlisted;
            const listed = req.body.listed;
            const sold = req.body.sold;
            const rejected = req.body.rejected;

            await ConnectionHelper.UpdateOne<ItemPurchase>("item-purchase", { items: { uuid: itemId } }, { $set: { 'items.$.quantities.unlisted': unlisted, 'items.$.quantities.listed': listed, 'items.$.quantities.sold': sold, 'items.$.quantities.rejected': rejected } });

            res.redirect(`/items/${itemId}`);
        });
    }
}
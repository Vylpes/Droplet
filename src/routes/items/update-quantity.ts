import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

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

            const item = await Item.FetchOneById<Item>(Item, itemId);
            
            item.EditQuantities(unlisted, listed, sold, rejected);

            await item.Save(Item, item);

            res.redirect(`/items/${itemId}`);
        });
    }
}
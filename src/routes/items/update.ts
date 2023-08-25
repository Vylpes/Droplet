import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Update extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("name")
                .NotEmpty();

        super.router.post('/:itemId/update', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const itemId = req.params.itemId;

            if (req.session.error) {
                res.redirect(`/items/${itemId}`);
                return;
            }

            const name = req.body.name;

            const item = await Item.FetchOneById<Item>(Item, itemId);

            item.EditBasicDetails(name);

            await item.Save(Item, item);

            res.redirect(`/items/${itemId}`);
        });
    }
}
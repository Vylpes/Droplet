import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import ItemPurchase from "../../contracts/entities/ItemPurchase/ItemPurchase";
import MessageHelper from "../../helpers/MessageHelper";
import Item from "../../contracts/entities/ItemPurchase/Item";
import { RoundTo } from "../../helpers/NumberHelper";

export default class Update extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("description")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number();

        super.router.post('/view/:Id/update', bodyValidation.Validate.bind(bodyValidation), UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/item-purchases/view/${Id}`);
                return;
            }

            const description = req.body.description;
            const price = req.body.price;

            await ConnectionHelper.UpdateOne<ItemPurchase>("item-purchase", { uuid: Id }, { description: description, price: price });

            res.redirect(`/item-purchases/view/${Id}`);
        });
    }
}
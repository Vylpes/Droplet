import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { ItemPurchase } from "../../database/entities/ItemPurchase";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class UpdateStatus extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("status")
                .NotEmpty()
                .Number();

        super.router.post('/view/:Id/update-status', bodyValidation.Validate.bind(bodyValidation), UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/item-purchases/view/${Id}`);
                return;
            }

            const status = req.body.status;

            const purchase = await ItemPurchase.FetchOneById(ItemPurchase, Id);

            purchase.UpdateStatus(status);

            await purchase.Save(ItemPurchase, purchase);

            res.redirect(`/item-purchases/view/${Id}`);
        });
    }
}
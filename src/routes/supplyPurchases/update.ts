import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { SupplyPurchase } from "../../database/entities/SupplyPurchase";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

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

        super.router.post('/view/:Id/update', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/supply-purchases/view/${Id}`);
                return;
            }

            const description = req.body.description;
            const price = req.body.price;

            const purchase = await SupplyPurchase.FetchOneById(SupplyPurchase, Id, [
                "Supplies"
            ]);

            purchase.UpdateBasicDetails(description, price);

            await purchase.Save(SupplyPurchase, purchase);
            await purchase.CalculateItemPrices();

            res.redirect(`/supply-purchases/view/${Id}`);
        });
    }
}
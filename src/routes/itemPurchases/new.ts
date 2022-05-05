import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { ItemPurchase } from "../../entity/ItemPurchase";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("description", "/item-purchases/ordered")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number();

        super.router.post('/new', bodyValidation.Validate.bind(bodyValidation), UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const description = req.body.description;
            const price = req.body.price;
            
            const purchase = new ItemPurchase(description, price);

            await purchase.Save(ItemPurchase, purchase);

            res.redirect('/item-purchases/ordered');
        });
    }
}
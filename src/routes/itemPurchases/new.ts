import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ItemPurchase from "../../contracts/entities/ItemPurchase/ItemPurchase";
import { v4 } from "uuid";
import { ItemPurchaseStatus } from "../../constants/Status/ItemPurchaseStatus";
import ConnectionHelper from "../../helpers/ConnectionHelper";

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

            const purchase: ItemPurchase = {
                uuid: v4(),
                description: description,
                price: price,
                status: ItemPurchaseStatus.Ordered,
                items: [],
                notes: [],
            }

            await ConnectionHelper.InsertOne<ItemPurchase>("item-purchase", purchase);

            res.redirect('/item-purchases/ordered');
        });
    }
}
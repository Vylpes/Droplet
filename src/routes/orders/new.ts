import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import Order from "../../contracts/entities/Order/Order";
import { v4 } from "uuid";
import { OrderStatus } from "../../constants/Status/OrderStatus";
import PostagePolicy from "../../contracts/entities/PostagePolicy/PostagePolicy";
import ItemPurchase from "../../contracts/entities/ItemPurchase/ItemPurchase";
import Listing from "../../contracts/entities/Listing/Listing";
import Item, { CalculateStatus } from "../../contracts/entities/ItemPurchase/Item";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("orderNumber", "/orders/awaiting-payment")
                .NotEmpty()
            .ChangeField("offerAccepted")
                .NotEmpty()
                .Boolean()
            .ChangeField("buyer")
                .NotEmpty()
            .ChangeField("amount")
                .NotEmpty()
                .Number()
            .ChangeField("listingId")
                .NotEmpty()
            .ChangeField("postagePolicyId")
                .NotEmpty();

        super.router.post('/new', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const orderNumber = req.body.orderNumber;
            const offerAccepted = req.body.offerAccepted;
            const buyer = req.body.buyer;
            const amount = req.body.amount;
            const listingId = req.body.listingId;
            const postagePolicyId = req.body.postagePolicyId;

            for (const item of listing.Items) {
                item.MarkAsSold(amount, ItemStatus.Listed);

                item.Save(Item, item);
            }

            const postagePolicyMaybe = await ConnectionHelper.FindOne<PostagePolicy>("postage-policy", { uuid: postagePolicyId });
            const postagePolicy = postagePolicyMaybe.Value!;

            const order: Order = {
                uuid: v4(),
                orderNumber,
                offerAccepted,
                price: amount,
                dispatchBy: new Date(),
                status: OrderStatus.AwaitingPayment,
                buyer: buyer,
                postagePolicy: {
                    uuid: v4(),
                    name: postagePolicy.name,
                    costToBuyer: postagePolicy.costToBuyer,
                    actualCost: postagePolicy.actualCost,
                },
                trackingNumbers: [],
                notes: [],
                r_listings: [ listingId ],
                r_supplies: [],
            }

            await ConnectionHelper.InsertOne<Order>("order", order);

            const listingMaybe = await ConnectionHelper.FindOne<Listing>("listing", { uuid: listingId });
            const listing = listingMaybe.Value!;

            const itemPurchaseMaybe = await ConnectionHelper.FindMultiple<ItemPurchase>("item-purchase", { items: { uuid: listing.r_items } });
            const itemPurchase = itemPurchaseMaybe.Value!;

            const items = itemPurchase.flatMap(x => x.items)
                .filter(x => listing.r_items.includes(x.uuid));

            const processedItems: Item[] = [];

            for (let item of items) {
                item.quantities.sold += amount;
                item.quantities.listed -= amount;
                item.status = CalculateStatus(item);

                processedItems.push(item);
            }

            res.redirect('/orders/awaiting-payment');
        });
    }
}
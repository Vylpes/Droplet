import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import { Listing } from "../../database/entities/Listing";
import { Order } from "../../database/entities/Order";
import PostagePolicy from "../../database/entities/PostagePolicy";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { ListingItem } from "../../database/entities/ListingItem";

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

            const listing = await Listing.FetchOneById(Listing, listingId, [
                "Items",
                "Items.Item",
                "PostagePolicy"
            ]);

            let postagePolicy: PostagePolicy;

            if (postagePolicyId == "INHERIT") {
                if (listing.PostagePolicy != null) {
                    postagePolicy = await PostagePolicy.FetchOneById(PostagePolicy, listing.PostagePolicy.Id);
                };
            } else {
                postagePolicy = await PostagePolicy.FetchOneById(PostagePolicy, postagePolicyId);
            }

            let order = new Order(orderNumber, offerAccepted, buyer);

            await order.Save(Order, order);

            order = await Order.FetchOneById(Order, order.Id, [
                "Listings",
                "PostagePolicy"
            ]);

            order.AddListingToOrder(listing, amount);

            if (postagePolicy != null) {
                order.AddPostagePolicyToOrder(postagePolicy);
            }

            await order.Save(Order, order);

            listing.MarkAsSold(amount);

            await listing.Save(Listing, listing);

            for (const item of listing.Items) {
                item.Item.MarkAsSold(amount, ItemStatus.Listed);

                await item.Save(ListingItem, item);
            }

            res.redirect('/orders/awaiting-payment');
        });
    }
}
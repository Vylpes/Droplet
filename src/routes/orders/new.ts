import { Request, Response } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import Page from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import { Listing } from "../../database/entities/Listing";
import { Order } from "../../database/entities/Order";
import PostagePolicy from "../../database/entities/PostagePolicy";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("orderNumber")
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

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect("/orders/awaiting-payment");
            return;
        }

        const orderNumber = req.body.orderNumber;
        const offerAccepted = req.body.offerAccepted;
        const buyer = req.body.buyer;
        const amount = req.body.amount;
        const listingId = req.body.listingId;
        const postagePolicyId = req.body.postagePolicyId;

        const listing = await Listing.FetchOneById(Listing, listingId, [
            "Items",
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

        order.AddListingToOrder(listing);

        if (postagePolicy != null) {
            order.AddPostagePolicyToOrder(postagePolicy);
        }

        await order.Save(Order, order);

        listing.MarkAsSold(amount);

        await listing.Save(Listing, listing);

        for (const item of listing.Items) {
            item.MarkAsSold(amount, ItemStatus.Listed);

            item.Save(Item, item);
        }

        res.redirect('/orders/awaiting-payment');
    }
}
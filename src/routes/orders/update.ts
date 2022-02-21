import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { Order } from "../../entity/Order";
import PostagePolicy from "../../entity/PostagePolicy";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Update extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/update', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }
            
            const orderNumber = req.body.orderNumber;
            const offerAccepted = req.body.offerAccepted;
            const buyer = req.body.buyer;
            const postagePolicyId = req.body.postagePolicyId;

            const order = await Order.FetchOneById(Order, Id);

            order.UpdateBasicDetails(orderNumber, offerAccepted, buyer);

            await order.Save(Order, order);

            if (postagePolicyId != "CURRENT") {
                const postagePolicy = await PostagePolicy.FetchOneById(PostagePolicy, postagePolicyId);

                order.AddPostagePolicyToOrder(postagePolicy);

                await order.Save(Order, order);
            }

            res.redirect(`/orders/view/${Id}`);
        });
    }
}
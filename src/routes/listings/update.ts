import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
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
            
            const name = req.body.name;
            const listingNumber = req.body.listingNumber;
            const price = req.body.price;
            const quantity = req.body.quantity;

            const listing = await Listing.FetchOneById(Listing, Id);

            listing.UpdateBasicDetails(name, listingNumber, price, quantity);

            await listing.Save(Listing, listing);

            res.redirect(`/listings/view/${Id}`);
        });
    }
}
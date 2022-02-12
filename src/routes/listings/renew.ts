import { Request, Response, Router } from "express";
import { ItemPurchaseStatus } from "../../constants/ItemPurchaseStatus";
import { ItemStatus } from "../../constants/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Renew extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/renew', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const Id = req.params.Id;

            const listing = await Listing.FetchOneById(Listing, Id, [
                "Items"
            ]);

            const endDate = req.body.endDate;

            listing.RenewListing(endDate);

            await listing.Save(Listing, listing);

            res.redirect(`/listings/view/${Id}`);
        });
    }
}
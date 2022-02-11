import { Request, Response, Router } from "express";
import { ItemPurchaseStatus } from "../../constants/ItemPurchaseStatus";
import { ItemStatus } from "../../constants/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class End extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/:Id/end', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const Id = req.params.Id;

            const listing = await Listing.FetchOneById(Listing, Id, [
                "Items"
            ]);

            listing.MarkAsUnsold();

            await listing.Save(Listing, listing);

            for (const item of listing.Items) {
                item.UpdateStatus(ItemStatus.Unlisted);

                await item.Save(Item, item);
            }

            res.redirect('/listings');
        });
    }
}
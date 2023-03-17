import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { Listing } from "../../entity/Listing";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class End extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/end', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const Id = req.params.Id;

            const listing = await Listing.FetchOneById(Listing, Id, [
                "Items"
            ]);

            listing.MarkAsUnsold();

            await listing.Save(Listing, listing);

            for (const item of listing.Items) {
                item.MarkAsUnlisted(listing.Quantity, ItemStatus.Listed);

                await item.Save(Item, item);
            }

            res.redirect('/listings/active');
        });
    }
}
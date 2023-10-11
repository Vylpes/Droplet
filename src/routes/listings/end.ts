import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import { Listing } from "../../database/entities/Listing";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class End extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/end', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const Id = req.params.Id;

            const listing = await Listing.FetchOneById(Listing, Id, [
                "Items",
                "Items.Item",
            ]);

            listing.MarkAsUnsold();

            await listing.Save(Listing, listing);

            for (const item of listing.Items) {
                item.Item.MarkAsUnlisted(listing.Quantity, ItemStatus.Listed);

                await item.Save(Item, item);
            }

            res.redirect('/listings/active');
        });
    }
}
import { NextFunction, Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { Listing } from "../../entity/Listing";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class AssignItem extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("itemId")
                .NotEmpty();

        super.router.post('/view/:Id/assign-item', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;
            
            if (req.session.error) {
                res.redirect(`/listings/view/${Id}`);
                return;
            }

            const itemId = req.body.itemId;

            const item = await Item.FetchOneById(Item, itemId);

            const listing = await Listing.FetchOneById(Listing, Id, [
                "Items"
            ]);

            listing.AddItemToListing(item);

            await listing.Save(Listing, listing);

            item.MarkAsListed(listing.Quantity, ItemStatus.Unlisted);

            await item.Save(Item, item);

            res.redirect(`/listings/view/${Id}`);
        });
    }
}
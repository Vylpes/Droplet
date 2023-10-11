import { NextFunction, Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../database/entities/Item";
import { Listing } from "../../database/entities/Listing";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import { ListingItem } from "../../database/entities/ListingItem";

export default class AssignItem extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("itemId")
                .NotEmpty()
            .ChangeField("quantity")
                .NotEmpty()
                .Number();

        super.router.post('/view/:Id/assign-item', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/listings/view/${Id}`);
                return;
            }

            const itemId = req.body.itemId;
            const quantity: number = req.body.quantity;

            const item = await Item.FetchOneById(Item, itemId);

            const listing = await Listing.FetchOneById(Listing, Id, [
                "Items",
                "Items.Item",
            ]);

            await listing.Save(Listing, listing);

            item.MarkAsListed(listing.Quantity, ItemStatus.Unlisted);

            await item.Save(Item, item);

            const existingItem = listing.Items.find(x => x.Item.Id == item.Id);

            if (existingItem) {
                existingItem.EditBasicDetails(Number(existingItem.Quantity) + Number(quantity));
                await existingItem.Save(ListingItem, existingItem);
            } else {
                const listingItem = new ListingItem(quantity);
                listingItem.AssignItem(item);
                listingItem.AssignListing(listing);

                await listingItem.Save(ListingItem, listingItem);
            }

            res.redirect(`/listings/view/${Id}`);
        });
    }
}
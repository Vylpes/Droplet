import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { Listing } from "../../entity/Listing";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("name", "/listings/active")
                .NotEmpty()
            .ChangeField("listingNumber")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number()
            .ChangeField("endDate")
                .NotEmpty()
            .ChangeField("quantity")
                .NotEmpty()
                .Number()
            .ChangeField("itemId")
                .NotEmpty();

        super.router.post('/new', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const name = req.body.name;
            const listingNumber = req.body.listingNumber;
            const price = req.body.price;
            const endDate = req.body.endDate;
            const quantity = req.body.quantity;
            const itemId = req.body.itemId;

            const item = await Item.FetchOneById(Item, itemId);
            
            let listing = new Listing(name, listingNumber, price, endDate, quantity);

            await listing.Save(Listing, listing);

            listing = await Listing.FetchOneById(Listing, listing.Id, [
                "Items"
            ]);;

            listing.AddItemToListing(item);

            await listing.Save(Listing, listing);

            item.MarkAsListed(quantity, ItemStatus.Unlisted);

            await item.Save(Item, item);

            res.redirect('/listings/active');
        });
    }
}
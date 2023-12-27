import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import { v4 } from "uuid";
import { ListingStatus } from "../../constants/Status/ListingStatus";
import CreateNewListingCommand from "../../domain/commands/Listing/CreateNewListingCommand";

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
            
            await CreateNewListingCommand(name, listingNumber, price, endDate, quantity, itemId);

            res.redirect('/listings/active');
        });
    }
}
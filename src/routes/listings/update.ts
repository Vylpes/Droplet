import { NextFunction, Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Listing } from "../../database/entities/Listing";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Update extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("name")
                .NotEmpty()
            .ChangeField("listingNumber")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number()
            .ChangeField("quantity")
                .NotEmpty()
                .Number();

        super.router.post('/view/:Id/update', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/listings/view/${Id}`);
                return;
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
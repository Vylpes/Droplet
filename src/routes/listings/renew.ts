import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Listing } from "../../entity/Listing";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Renew extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("endDate")
                .NotEmpty();

        super.router.post('/view/:Id/renew', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/listings/view/${Id}`);
                return;
            }

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
import { Request, Response } from "express";
import Page from "../../contracts/Page";
import { Listing } from "../../database/entities/Listing";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class Renew implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("endDate")
                .NotEmpty();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req.body)) {
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
    }
}
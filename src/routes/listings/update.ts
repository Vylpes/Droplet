import { NextFunction, Request, Response } from "express";
import Page from "../../contracts/Page";
import { Listing } from "../../database/entities/Listing";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("name")
                .NotEmpty()
            .ChangeField("listingNumber")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number()
            .ChangeField("quantity")
                .NotEmpty()
                .Number();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req.body)) {
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
    }
}
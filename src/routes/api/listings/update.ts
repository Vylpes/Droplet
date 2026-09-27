import { NextFunction, Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { Listing } from "../../../database/entities/Listing";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapListing } from "../../../dto";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("name")
                .NotEmpty()
            .ChangeField("listingNumber")
                .NotEmpty()
            .ChangeField("price")
                .NotEmpty()
                .Number()
            .ChangeField("quantity")
                .NotEmpty()
                .Number();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const name = req.body.name;
        const listingNumber = req.body.listingNumber;
        const price = req.body.price;
        const quantity = req.body.quantity;

        const listing = await Listing.FetchOneById(Listing, Id);

        listing.UpdateBasicDetails(name, listingNumber, price, quantity);

        await listing.Save(Listing, listing);

        res.json(GenerateResponse(true, "Listing updated", mapListing(listing)));
    }
}

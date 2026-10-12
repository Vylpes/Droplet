import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../contracts/IBasicResponse";
import { Listing } from "../../../database/entities/Listing";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapListing } from "../../../dto";

export default class Renew implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new ApiBodyValidator("endDate")
                .NotEmpty();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const listing = await Listing.FetchOneById(Listing, Id, {
            Items: true
        });

        const endDate = req.body.endDate;

        listing.RenewListing(endDate);

        await listing.Save(Listing, listing);

        res.json(GenerateResponse(true, "Listing renewed", mapListing(listing, true)));
    }
}

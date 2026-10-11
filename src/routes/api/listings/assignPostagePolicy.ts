import { NextFunction, Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../contracts/IBasicResponse";
import { Listing } from "../../../database/entities/Listing";
import PostagePolicy from "../../../database/entities/PostagePolicy";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapListing } from "../../../dto";

export default class AssignPostagePolicy implements Page {
    public async OnPostAsync(req: Request, res: Response, _next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("policyId")
                .NotEmpty();

        const Id = (req.params.Id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const policyId = req.body.policyId;

        const policy = await PostagePolicy.FetchOneById(PostagePolicy, policyId);

        const listing = await Listing.FetchOneById(Listing, Id, {
            PostagePolicy: true
        });

        listing.AddPostagePolicyToListing(policy);

        await listing.Save(Listing, listing);

        res.json(GenerateResponse(true, "Postage policy assigned", mapListing(listing)));
    }
}

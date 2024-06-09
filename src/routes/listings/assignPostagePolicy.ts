import { NextFunction, Request, Response } from "express";
import Page from "../../contracts/Page";
import { Listing } from "../../database/entities/Listing";
import PostagePolicy from "../../database/entities/PostagePolicy";
import BodyValidator from "../../helpers/Validation/BodyValidator";
import createHttpError from "http-errors";

export default class AssignPostagePolicy implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new BodyValidator("policyId")
                .NotEmpty();

        const Id = req.params.Id;

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect(`/listings/view/${Id}`);
            return;
        }

        const policyId = req.body.policyId;

        const policy = await PostagePolicy.FetchOneById(PostagePolicy, policyId);

        if (!policy) {
            next(createHttpError(404));
            return;
        }

        const listing = await Listing.FetchOneById(Listing, Id, [
            "PostagePolicy"
        ]);

        if (!listing) {
            next(createHttpError(404));
            return;
        }

        listing.AddPostagePolicyToListing(policy);

        await listing.Save(Listing, listing);

        res.redirect(`/listings/view/${Id}`);
    }
}
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import PostagePolicy from "../../entity/PostagePolicy";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class AssignPostagePolicy extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/view/:Id/assign-postage-policy', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }
            
            const policyId = req.body.policyId;

            const policy = await PostagePolicy.FetchOneById(PostagePolicy, policyId);

            const listing = await Listing.FetchOneById(Listing, Id, [
                "PostagePolicy"
            ]);

            listing.AddPostagePolicyToListing(policy);

            await listing.Save(Listing, listing);

            res.redirect(`/listings/view/${Id}`);
        });
    }
}
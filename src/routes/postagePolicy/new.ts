import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import PostagePolicy from "../../entity/PostagePolicy";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/new', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const name = req.body.name;
            const costToBuyer = req.body.costToBuyer;
            const actualCost = req.body.actualCost;

            const policy = new PostagePolicy(name, costToBuyer, actualCost);

            await policy.Save(PostagePolicy, policy);

            res.redirect('/postage-policies');
        });
    }
}
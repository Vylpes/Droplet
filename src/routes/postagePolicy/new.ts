import { Request, Response } from "express";
import Page from "../../contracts/Page";
import PostagePolicy from "../../database/entities/PostagePolicy";
import BodyValidator from "../../helpers/Validation/BodyValidator";

export default class New implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new BodyValidator("name")
                .NotEmpty()
            .ChangeField("costToBuyer")
                .NotEmpty()
                .Number()
            .ChangeField("actualCost")
                .NotEmpty()
                .Number();

        if (!await bodyValidation.Validate(req.body)) {
            res.redirect("/postage-policies");
            return;
        }

        const name = req.body.name;
        const costToBuyer = req.body.costToBuyer;
        const actualCost = req.body.actualCost;

        const policy = new PostagePolicy(name, costToBuyer, actualCost);

        await policy.Save(PostagePolicy, policy);

        res.redirect('/postage-policies');
    }
}
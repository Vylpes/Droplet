import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import PostagePolicy from "../../database/entities/PostagePolicy";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import CreatePostagePolicyCommand from "../../domain/commands/PostagePolicy/CreatePostagePolicyCommand";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("name", "/postage-policies")
                .NotEmpty()
            .ChangeField("costToBuyer")
                .NotEmpty()
                .Number()
            .ChangeField("actualCost")
                .NotEmpty()
                .Number();

        super.router.post('/new', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const name = req.body.name;
            const costToBuyer = req.body.costToBuyer;
            const actualCost = req.body.actualCost;
            
            await CreatePostagePolicyCommand(name, costToBuyer, actualCost);

            res.redirect('/postage-policies');
        });
    }
}
import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import PostagePolicy from "../../database/entities/PostagePolicy";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import UpdatePostagePolicyBasicDetailsCommand from "../../domain/commands/PostagePolicy/UpdatePostagePolicyBasicDetailsCommand";

export default class Update extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("name")
                .NotEmpty()
            .ChangeField("costToBuyer")
                .NotEmpty()
                .Number()
            .ChangeField("actualCost")
                .NotEmpty()
                .Number();

        super.router.post('/:id/update', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const id = req.params.id;

            if (req.session.error) {
                res.redirect(`/postage-policies/${id}`);
                return;
            }

            const name = req.body.name;
            const costToBuyer = req.body.costToBuyer;
            const actualCost = req.body.actualCost;
            
            await UpdatePostagePolicyBasicDetailsCommand(id, name, costToBuyer, actualCost);

            res.redirect(`/postage-policies/${id}`);
        });
    }
}
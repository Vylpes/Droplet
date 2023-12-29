import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Return } from "../../database/entities/Return";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import MarkReturnAsStartedCommand from "../../domain/commands/Return/MarkReturnAsStartedCommand";

export default class Started extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("returnBy")
                .NotEmpty();

        super.router.post('/view/:Id/started', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const Id = req.params.Id;

            if (req.session.error) {
                res.redirect(`/returns/view/${Id}`);
                return;
            }

            const returnBy = req.body.returnBy;
            
            await MarkReturnAsStartedCommand(Id, returnBy);

            res.redirect(`/returns/view/${Id}`);
        });
    }
}
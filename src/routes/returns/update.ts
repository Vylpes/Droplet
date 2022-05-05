import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { Order } from "../../entity/Order";
import { Return } from "../../entity/Return";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class Update extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("returnNumber")
                .NotEmpty()
            .ChangeField("returnBy")
                .NotEmpty();

        super.router.post('/view/:Id/update', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;
            
            if (req.session.error) {
                res.redirect(`/returns/view/${Id}`);
                return;
            }

            const returnNumber = req.body.returnNumber;
            const returnBy = req.body.returnBy;

            const ret = await Return.FetchOneById(Return, Id);
            
            ret.UpdateBasicDetails(returnNumber, ret.RMA, returnBy);

            await ret.Save(Return, ret);

            res.redirect(`/returns/view/${Id}`);
        });
    }
}
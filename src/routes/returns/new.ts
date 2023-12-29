import { Request, Response, Router } from "express";
import { TrackingNumberType } from "../../constants/TrackingNumberType";
import { Page } from "../../contracts/Page";
import { Order } from "../../database/entities/Order";
import { Return } from "../../database/entities/Return";
import { TrackingNumber } from "../../database/entities/TrackingNumber";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import CreateNewReturnCommand from "../../domain/commands/Return/CreateNewReturnCommand";
import AssignTrackingNumberToReturnCommand from "../../domain/commands/Return/AssignTrackingNumberToReturnCommand";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("returnNumber", "/returns/opened")
                .NotEmpty()
            .ChangeField("orderId")
                .NotEmpty()
            .ChangeField("trackingNumber")
                .NotEmpty()
            .ChangeField("trackingService")
                .NotEmpty()
                .Number();

        super.router.post('/new', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const returnNumber = req.body.returnNumber;
            const orderId = req.body.orderId;
            const trackingNum = req.body.trackingNumber;
            const trackingService = req.body.trackingService;
            const rma = await Return.GenerateRMA();

            const ret = await CreateNewReturnCommand(returnNumber, rma, orderId);
            
            await AssignTrackingNumberToReturnCommand(ret.uuid, trackingNum, trackingService);

            res.redirect(`/returns/opened`);
        });
    }
}
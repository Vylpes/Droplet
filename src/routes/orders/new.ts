import { Request, Response, Router } from "express";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { Page } from "../../contracts/Page";
import Body from "../../helpers/Validation/Body";
import { UserMiddleware } from "../../middleware/userMiddleware";
import ConnectionHelper from "../../helpers/ConnectionHelper";
import { v4 } from "uuid";
import { OrderStatus } from "../../constants/Status/OrderStatus";
import CreateNewOrderCommand from "../../domain/commands/Order/CreateNewOrderCommand";
import GetOnePostagePolicyById from "../../domain/queries/PostagePolicy/GetOnePostagePolicyById";
import GetAllItemsAssignedByListingId from "../../domain/queries/Item/GetAllItemsAssignedByListingId";
import UpdateItemQuantityCommand from "../../domain/commands/Item/UpdateItemQuantityCommand";
import UpdateItemBasicDetailsCommand from "../../domain/commands/Item/UpdateItemBasicDetailsCommand";
import UpdateItemStatusCommand from "../../domain/commands/Item/UpdateItemStatusCommand";
import { CalculateStatus } from "../../domain/models/Item/Item";

export default class New extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        const bodyValidation = new Body("orderNumber", "/orders/awaiting-payment")
                .NotEmpty()
            .ChangeField("offerAccepted")
                .NotEmpty()
                .Boolean()
            .ChangeField("buyer")
                .NotEmpty()
            .ChangeField("amount")
                .NotEmpty()
                .Number()
            .ChangeField("listingId")
                .NotEmpty()
            .ChangeField("postagePolicyId")
                .NotEmpty();

        super.router.post('/new', UserMiddleware.Authorise, bodyValidation.Validate.bind(bodyValidation), async (req: Request, res: Response) => {
            const orderNumber = req.body.orderNumber;
            const offerAccepted = req.body.offerAccepted;
            const buyer = req.body.buyer;
            const amount = req.body.amount;
            const listingId = req.body.listingId;
            const postagePolicyId = req.body.postagePolicyId;

            const postagePolicy = await GetOnePostagePolicyById(postagePolicyId);

            await CreateNewOrderCommand(orderNumber, amount, offerAccepted, buyer, postagePolicy.name, postagePolicy.costToBuyer, postagePolicy.actualCost);

            const items = await GetAllItemsAssignedByListingId(listingId);

            for (let item of items) {
                await UpdateItemQuantityCommand(item.uuid, item.quantities.unlisted, item.quantities.listed -= amount, item.quantities.sold += amount, item.quantities.rejected);
                await UpdateItemStatusCommand(item.uuid, CalculateStatus(item));
            }

            res.redirect('/orders/awaiting-payment');
        });
    }
}
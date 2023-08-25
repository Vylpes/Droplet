import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { OrderStatus } from "../../constants/Status/OrderStatus";
import { ReturnStatus } from "../../constants/Status/ReturnStatus";
import { Page } from "../../contracts/Page"
import { Item } from "../../database/entities/Item";
import { Order } from "../../database/entities/Order";
import { Return } from "../../database/entities/Return";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:status', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const status = req.params.status;

            const returns = await Return.FetchAll(Return, [
                "Order"
            ]);

            const orders = await Item.FetchAll(Order);

            let visible: Return[];

            switch(status) {
                case 'opened':
                    visible = returns.filter(x => x.Status == ReturnStatus.Opened);
                    break;
                case 'started':
                    visible = returns.filter(x => x.Status == ReturnStatus.Started);
                    break;
                case 'posted':
                    visible = returns.filter(x => x.Status == ReturnStatus.ItemPosted);
                    break;
                case 'received':
                    visible = returns.filter(x => x.Status == ReturnStatus.ItemReceived);
                    break;
                case 'refunded':
                    visible = returns.filter(x => x.Status == ReturnStatus.Refunded);
                    break;
                case 'closed':
                    visible = returns.filter(x => x.Status == ReturnStatus.Closed)
                    break;
                case 'expired':
                    visible = returns.filter(x => !(x.Status == ReturnStatus.Closed || x.Status == ReturnStatus.Refunded || x.Status == ReturnStatus.Opened) && x.ReturnBy < new Date());
                    break;
                default:
                    next(createHttpError(404));
                    return;
            }

            res.locals.viewData.returns = visible;
            res.locals.viewData.orders = orders.filter(x => x.Status == OrderStatus.Dispatched && x.DispatchBy > new Date(new Date().getTime () - (1000 * 60 * 60 * 32)));

            res.render(`returns/list/${status}`, res.locals.viewData);
        });
    }
}
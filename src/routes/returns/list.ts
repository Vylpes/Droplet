import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { OrderStatus } from "../../constants/Status/OrderStatus";
import { ReturnStatus, ReturnStatusParse } from "../../constants/Status/ReturnStatus";
import { Page } from "../../contracts/Page"
import { Item } from "../../database/entities/Item";
import { Order } from "../../database/entities/Order";
import { Return } from "../../database/entities/Return";
import { UserMiddleware } from "../../middleware/userMiddleware";
import GetAllReturnsByStatus from "../../domain/queries/Return/GetAllReturnsByStatus";
import GetAllOrdersByStatus from "../../domain/queries/Order/GetAllOrdersByStatus";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:status', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const statusString = req.params.status;
            const status = ReturnStatusParse.get(statusString);
            
            const returns = await GetAllReturnsByStatus(status);
            const orders = await GetAllOrdersByStatus(OrderStatus.Dispatched);

            res.locals.viewData.returns = returns;
            res.locals.viewData.orders = orders.filter(x => x.dispatchBy > new Date(new Date().getTime () - (1000 * 60 * 60 * 32)));

            res.render(`returns/list/${status}`, res.locals.viewData);
        });
    }
}
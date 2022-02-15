import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { ItemStatus } from "../../constants/Status/ItemStatus";
import { ListingStatus } from "../../constants/Status/ListingStatus";
import { OrderStatus } from "../../constants/Status/OrderStatus";
import { Page } from "../../contracts/Page"
import { Item } from "../../entity/Item";
import { ItemPurchase } from "../../entity/ItemPurchase";
import { Listing } from "../../entity/Listing";
import { Order } from "../../entity/Order";
import { SupplyPurchase } from "../../entity/SupplyPurchase";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/:status', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            let status = req.params.status;

            const orders = await Order.FetchAll(Order, [
                "Listings"
            ]);

            const listings = await Listing.FetchAll(Listing);

            let visible: Order[];

            switch(status) {
                case 'awaiting-payment':
                    visible = orders.filter(x => x.Status == OrderStatus.AwaitingPayment);
                    break;
                case 'awaiting-dispatch':
                    visible = orders.filter(x => x.Status == OrderStatus.AwaitingDispatch);
                    break;
                case 'recently-dispatched':
                    visible = orders.filter(x => x.Status == OrderStatus.Dispatched && x.DispatchBy > new Date(new Date().getTime () - (1000 * 60 * 60 * 32)));
                    break;
                case 'dispatched':
                    visible = orders.filter(x => x.Status == OrderStatus.Dispatched);
                    break;
                case 'cancelled':
                    visible = orders.filter(x => x.Status == OrderStatus.Cancelled);
                    break;
                case 'returned':
                    visible = orders.filter(x => x.Status == OrderStatus.Returned);
                    break;
                default:
                    next(createHttpError(404));
                    return;
            }

            res.locals.orders = visible;
            res.locals.listings = listings.filter(x => x.Status == ListingStatus.Active);

            res.render(`orders/list/${status}`, res.locals.viewData);
        });
    }
}
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { ListingStatus } from "../../constants/Status/ListingStatus";
import { OrderStatus } from "../../constants/Status/OrderStatus";
import Page from "../../contracts/Page"
import { Listing } from "../../database/entities/Listing";
import { Order } from "../../database/entities/Order";
import PostagePolicy from "../../database/entities/PostagePolicy";

export default class List implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        let status = req.params.status;

        const orders = await Order.FetchAll(Order, [
            "Listings"
        ]);

        const listings = await Listing.FetchAll(Listing);

        const postagePolicies = await PostagePolicy.FetchAll(PostagePolicy);

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
        res.locals.postagePolicies = postagePolicies.filter(x => !x.Archived);

        res.render(`orders/list/${status}`, res.locals.viewData);
    }
}
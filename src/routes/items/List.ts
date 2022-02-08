import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page"
import { Item } from "../../entity/Item";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class List extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnGet(): void {
        super.router.get('/', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const items = await Item.GetAllItems();

            res.locals.items = items;

            res.render('items/list');
        });
    }
}
import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { Page } from "../../contracts/Page";
import { Item } from "../../entity/Item";
import { Supply } from "../../entity/Supply";
import { UserMiddleware } from "../../middleware/userMiddleware";

export default class UpdateQuantity extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost(): void {
        super.router.post('/:Id/update-quantity', UserMiddleware.Authorise, async (req: Request, res: Response, next: NextFunction) => {
            const Id = req.params.Id;

            if (!Id) {
                next(createHttpError(404));
            }
            
            const unused = req.body.unused;
            const used = req.body.used;

            const supply = await Supply.FetchOneById<Supply>(Supply, Id);

            supply.SetStock(unused, used);

            await supply.Save(Supply, supply);

            res.redirect(`/supplies/${Id}`);
        });
    }
}
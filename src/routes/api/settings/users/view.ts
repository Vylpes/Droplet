import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Page from "../../../../contracts/Page";
import { GenerateResponse } from "../../../../contracts/IBasicResponse";
import { User } from "../../../../database/entities/User";
import { mapUser } from "../../../../dto";

export default class View implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const id = (req.params.id as string);

        if (!id) {
            next(createHttpError(404));
            return;
        }

        const user = await User.FetchOneById(User, id);

        if (!user) {
            next(createHttpError(404));
            return;
        }

        res.json(GenerateResponse(true, undefined, mapUser(user)));
    }
}

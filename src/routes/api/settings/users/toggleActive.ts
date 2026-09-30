import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Page from "../../../../contracts/Page";
import { GenerateResponse } from "../../../../contracts/IBasicResponse";
import { User } from "../../../../database/entities/User";
import { mapUser } from "../../../../dto";

export default class ToggleActive implements Page {
    public async OnGetAsync(req: Request, res: Response, next: NextFunction) {
        const id = (req.params.id as string);
        const currentUser = req.session.User;

        if (!id || !currentUser) {
            next(createHttpError(404));
            return;
        }

        const user = await User.FetchOneById(User, id);

        if (!user) {
            next(createHttpError(404));
            return;
        }

        if (user.Id == currentUser.Id) {
            res.status(400).json(GenerateResponse(false, "You can not deactivate yourself"));
            return;
        }

        user.ToggleActive();

        await user.Save(User, user);

        res.json(GenerateResponse(true, "User active status toggled", mapUser(user)));
    }
}

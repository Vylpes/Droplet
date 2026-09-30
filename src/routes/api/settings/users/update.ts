import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import Page from "../../../../contracts/Page";
import { GenerateResponse } from "../../../../contracts/IBasicResponse";
import { User } from "../../../../database/entities/User";
import ApiBodyValidator from "../../../../helpers/Validation/ApiBodyValidator";
import { mapUser } from "../../../../dto";

export default class Update implements Page {
    public async OnPostAsync(req: Request, res: Response, next: NextFunction) {
        const bodyValidation = new ApiBodyValidator("username")
                .NotEmpty()
            .ChangeField("email")
                .NotEmpty()
                .EmailAddress()
            .ChangeField("admin")
                .NotEmpty()
                .Boolean()
            .ChangeField("active")
                .NotEmpty()
                .Boolean();

        const id = (req.params.id as string);

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const user = await User.FetchOneById(User, id);

        if (!user) {
            next(createHttpError(404));
            return;
        }

        const username = req.body.username;
        const email = req.body.email;
        const admin = req.body.admin;
        const active = req.body.active;

        const adminBool = admin == 'true';
        const activeBool = active == 'true';

        user.UpdateBasicDetails(email, username, adminBool, activeBool);

        await user.Save(User, user);

        res.json(GenerateResponse(true, "User updated", mapUser(user)));
    }
}

import { hash } from "bcryptjs";
import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../contracts/IBasicResponse";
import { User } from "../../../database/entities/User";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapUser } from "../../../dto";

export default class Account implements Page {
    public OnGet(req: Request, res: Response) {
        const user = req.session.User;

        res.json(GenerateResponse(true, undefined, user ? mapUser(user) : undefined));
    }

    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new ApiBodyValidator("email")
                .NotEmpty()
            .ChangeField("currentPassword")
                .NotEmpty()
                    .WithMessage("Your current password is required to make changes")
            .ChangeField("newPassword")
                .EqualToField("passwordConfirm")
                    .WithMessage("Passwords must match")
            .ChangeField("username")
                .NotEmpty();

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const user = req.session.User;
        const email = req.body.email;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        const username = req.body.username;

        if (!user || !email || !currentPassword || !username) {
            res.status(400).json(GenerateResponse(false, "Email, Current Password, and Username are required"));
            return;
        }

        if (!await User.IsLoginCorrect(user.Email, currentPassword)) {
            res.status(400).json(GenerateResponse(false, "Your password is incorrect"));
            return;
        }

        const userFromDb = await User.FetchOneById(User, user.Id);

        if (!userFromDb) {
            res.status(400).json(GenerateResponse(false, "Sorry an error has occurred."));
            return;
        }

        userFromDb.UpdateBasicDetails(email, username, user.Admin, user.Active);

        if (newPassword) {
            const hashedPassword = await hash(newPassword, 10);
            userFromDb.UpdatePassword(hashedPassword);
        }

        await userFromDb.Save(User, userFromDb);

        req.session.User = userFromDb;

        res.json(GenerateResponse(true, "Account updated", mapUser(userFromDb)));
    }
}

import { hash } from "bcryptjs";
import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse, GenerateValidationResponse } from "../../../contracts/IBasicResponse";
import { User } from "../../../database/entities/User";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapUser } from "../../../dto";

export default class AdminRegister implements Page {
    public async OnGetAsync(req: Request, res: Response) {
        if (req.session.User || await User.Any(User)) {
            res.status(403).json(GenerateResponse(false, "Admin registration is not available"));
            return;
        }

        res.json(GenerateResponse(true, "Admin registration is available"));
    }

    public async OnPostAsync(req: Request, res: Response) {
        if (req.session.User || await User.Any(User)) {
            res.status(403).json(GenerateResponse(false, "Admin registration is not available"));
            return;
        }

        const bodyValidation = new ApiBodyValidator("username")
                .NotEmpty()
            .ChangeField("email")
                .NotEmpty()
                .EmailAddress()
            .ChangeField("password")
                .NotEmpty()
            .ChangeField("passwordRepeat")
                .NotEmpty()
                .EqualToField("password")
                    .WithMessage("Passwords do not match");

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateValidationResponse(error));
            return;
        }

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const hashedPassword = await hash(password, 10);
        const user = new User(email, username, hashedPassword, true, true, true);

        await user.Save(User, user);

        res.json(GenerateResponse(true, "Successfully registered admin user", mapUser(user)));
    }
}

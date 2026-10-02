import { Request, Response } from "express";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { User } from "../../../database/entities/User";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapUser } from "../../../dto";

export default class Login implements Page {
    public async OnPostAsync(req: Request, res: Response) {
        const bodyValidation = new ApiBodyValidator("email")
                .NotEmpty()
                .EmailAddress()
            .ChangeField("password")
                .NotEmpty();

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.FetchOneByEmail(email);

        if (!user || !user.Active) {
            res.status(401).json(GenerateResponse(false, "Your account has been deactivated."));
            return;
        }

        if (!await User.IsLoginCorrect(email, password)) {
            res.status(401).json(GenerateResponse(false, "Password is incorrect"));
            return;
        }

        try {
            await new Promise<void>((resolve, reject) => {
                req.session.regenerate(err => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });

            req.session.User = user;

            await new Promise<void>((resolve, reject) => {
                req.session.save(err => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });

            res.json(GenerateResponse(true, "Logged in", mapUser(user)));
        } catch {
            res.status(500).json(GenerateResponse(false, "Failed to create session"));
        }
    }
}

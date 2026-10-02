import { compareSync, hash } from "bcryptjs";
import { Request, Response } from "express";
import { UserTokenType } from "../../../constants/UserTokenType";
import Page from "../../../contracts/Page";
import { GenerateResponse } from "../../../contracts/IBasicResponse";
import { User } from "../../../database/entities/User";
import UserToken from "../../../database/entities/UserToken";
import ApiBodyValidator from "../../../helpers/Validation/ApiBodyValidator";
import { mapUser } from "../../../dto";

async function findVerificationToken(token: string): Promise<UserToken | undefined> {
    const tokens = await UserToken.FetchAll(UserToken, {
        User: true
    });

    const userToken = tokens.filter(x => compareSync(token, x.Token))[0];

    if (!userToken) {
        return undefined;
    }

    if (await userToken.CheckIfExpired()) {
        return undefined;
    }

    if (userToken.Type != UserTokenType.Verification) {
        return undefined;
    }

    return userToken;
}

function resolveToken(req: Request): string | undefined {
    const fromQuery = req.query.token?.toString();
    const fromBody = req.body?.token?.toString();
    return fromQuery || fromBody || undefined;
}

export default class Verify implements Page {
    public async OnGetAsync(req: Request, res: Response) {
        if (req.session.User) {
            res.status(403).json(GenerateResponse(false, "Already authenticated"));
            return;
        }

        const token = resolveToken(req);

        if (!token) {
            res.status(400).json(GenerateResponse(false, "token is required"));
            return;
        }

        const userToken = await findVerificationToken(token);

        if (!userToken) {
            res.status(401).json(GenerateResponse(false, "Invalid or expired verification token"));
            return;
        }

        res.json(GenerateResponse(true, undefined, mapUser(userToken.User)));
    }

    public async OnPostAsync(req: Request, res: Response) {
        const token = resolveToken(req);

        if (!token) {
            res.status(400).json(GenerateResponse(false, "token is required"));
            return;
        }

        const bodyValidation = new ApiBodyValidator("password")
                .NotEmpty()
                .MinLength(8)
                .EqualToField("passwordRepeat")
                    .WithMessage("Passwords must match");

        const error = bodyValidation.Validate(req);
        if (error) {
            res.status(400).json(GenerateResponse(false, error));
            return;
        }

        const password = req.body.password;
        const userToken = await findVerificationToken(token);

        if (!userToken) {
            res.status(401).json(GenerateResponse(false, "Invalid or expired verification token"));
            return;
        }

        const hashed = await hash(password, 10);

        userToken.User.UpdatePassword(hashed);
        userToken.User.Verify();

        await userToken.User.Save(User, userToken.User);
        await UserToken.Remove(UserToken, userToken);

        res.json(GenerateResponse(true, "You are now verified, please now login", mapUser(userToken.User)));
    }
}

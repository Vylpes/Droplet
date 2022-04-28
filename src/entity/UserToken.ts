import { Column, Entity, getConnection, ManyToOne, OneToOne } from "typeorm";
import { UserTokenType } from "../constants/UserTokenType";
import BaseEntity from "../contracts/BaseEntity";
import { User } from "./User";

@Entity()
export default class UserToken extends BaseEntity {
    constructor(token: string, expires: Date, type: UserTokenType) {
        super();

        this.Token = token;
        this.Expires = expires;
        this.Type = type;
    }

    @Column()
    Token: string;

    @Column()
    Expires: Date;

    @Column()
    Type: UserTokenType;

    @ManyToOne(() => User, user => user.Tokens)
    User: User;

    public async CheckIfExpired(): Promise<boolean> {
        const now = new Date();

        const expired = now > this.Expires;

        if (expired) {
            await UserToken.Remove(UserToken, this);
        }

        return expired;
    }

    public static async FetchOneByToken<T>(token: string, relations?: string[]): Promise<UserToken> {
        const connection = getConnection();

        const repository = connection.getRepository(UserToken);

        const single = await repository.findOne({ Token: token }, { relations: relations || [] });

        return single;
    }

    public static async InvalidateAllTokensForUser(userId: string) {
        const connection = getConnection();

        const repository = connection.getRepository(User);

        const single = await repository.findOne(userId, { relations: [
            "Tokens",
        ]});

        if (!single) return;

        const tokens = single.Tokens;

        for (let i = 0; i < tokens.length; i++) {
            await UserToken.Remove(UserToken, tokens[i]);
        }

        await single.Save(User, single);
    }
}
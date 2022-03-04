import { compare, hash } from "bcryptjs";
import {Entity, Column, PrimaryColumn, getConnection, OneToMany} from "typeorm";
import { v4 as uuid } from "uuid";
import BaseEntity from "../contracts/BaseEntity";
import { IBasicResponse, GenerateResponse } from "../contracts/IBasicResponse";
import UserToken from "./UserToken";

@Entity()
export class User extends BaseEntity {
    constructor(email: string, username: string, password: string, verified: boolean, admin: boolean, active: boolean) {
        super();

        this.Email = email;
        this.Username = username;
        this.Password = password;
        this.Verified = verified;
        this.Admin = admin;
        this.Active = active;
    }

    @Column()
    Email: string;

    @Column()
    Username: string;

    @Column()
    Password: string;

    @Column()
    Verified: boolean;

    @Column()
    Admin: boolean;

    @Column()
    Active: boolean;

    @OneToMany(() => UserToken, userToken => userToken.User)
    Tokens: UserToken[];

    public UpdateBasicDetails(email: string, username: string, admin: boolean, active: boolean) {
        this.Email = email;
        this.Username = username;
        this.Admin = admin;
        this.Active = active;
    }

    public UpdatePassword(password: string) {
        this.Password = password;
    }

    public AddTokenToUser(token: UserToken) {
        this.Tokens.push(token);
    }

    public Verify() {
        this.Verified = true;
    }

    public static async IsLoginCorrect(email: string, password: string): Promise<boolean> {
        const connection = getConnection();

        const userRepository = connection.getRepository(User);

        const user = await userRepository.findOne({ Email: email });

        if (!user) {
            return false;
        }

        const same = await compare(password, user.Password);
        
        return same;
    }

    public static async FetchOneByUsername(username: string, relations?: string[]): Promise<User | undefined> {
        const connection = getConnection();

        const repository = connection.getRepository(User);

        const single = await repository.findOne({ Username: username }, { relations: relations || [] });

        if (!single) {
            return undefined;
        }

        return single;
    }

    public static async FetchOneByEmail(email: string, relations?: string[]): Promise<User | undefined> {
        const connection = getConnection();

        const repository = connection.getRepository(User);

        const single = await repository.findOne({ Email: email }, { relations: relations || [] });

        if (!single) {
            return undefined;
        }

        return single;
    }
}

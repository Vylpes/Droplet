import { compare, hash } from "bcryptjs";
import {Entity, Column, PrimaryColumn, getConnection} from "typeorm";
import { v4 as uuid } from "uuid";
import BaseEntity from "../contracts/BaseEntity";
import { IBasicResponse, GenerateResponse } from "../contracts/IBasicResponse";

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

    public EditBasicDetails(email: string, username: string, password: string) {
        this.Email = email;
        this.Username = username;
        this.Password = password;
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

    public static async RegisterUser(username: string, email: string, password: string, passwordRepeat: string): Promise<boolean> {
        if (password !== passwordRepeat) {
            return false;
        }

        if (password.length < 7) {
            return false;
        }

        const connection = getConnection();

        const userRepository = connection.getRepository(User);

        let user = await userRepository.findAndCount({ Email: email });

        if(user[1] > 0) {
            return false;
        }

        user = await userRepository.findAndCount({ Username: username });

        if (user[1] > 0) {
            return false;
        }

        const activeUsers = await userRepository.find({ Active: true });

        var firstUser = activeUsers.length == 0;

        const hashedPassword = await hash(password, 10);

        const createdUser = new User(email, username, hashedPassword, false, firstUser, true);

        userRepository.save(createdUser);
        
        return true;
    }

    public static async GetUser(userId: string): Promise<User> {
        const connection = getConnection();

        const userRepository = connection.getRepository(User);

        return await userRepository.findOne(userId);
    }

    public static async GetUserByEmailAddress(email: string): Promise<User> {
        const connection = getConnection();

        const userRepository = connection.getRepository(User);

        return await userRepository.findOne({ Email: email });
    }

    public static async GetUserByUsername(username: string): Promise<User> {
        const connection = getConnection();

        const userRepository = connection.getRepository(User);

        return await userRepository.findOne({ Username: username });
    }

    public static async UpdateCurrentUserDetails(currentUser: User, email: string, username: string, password: string): Promise<IBasicResponse> {
        const connection = getConnection();

        const userRepo = connection.getRepository(User);

        const user = await userRepo.findOne(currentUser.Id);

        if (!user) {
            return GenerateResponse(false, "User not found");
        }

        const userByEmail = await User.GetUserByEmailAddress(email);
        const userByUsername = await User.GetUserByUsername(username);

        if (currentUser.Email != email && userByEmail) {
            return GenerateResponse(false, "Email already in use");
        }

        if (currentUser.Username != username && userByUsername) {
            return GenerateResponse(false, "Username already in use");
        }

        if (password.length < 7) {
            return GenerateResponse(false, "Password must be at least 7 characters long");
        }

        const hashedPassword = await hash(password, 10);

        user.EditBasicDetails(email, username, hashedPassword);

        await userRepo.save(user);

        return GenerateResponse();
    }
}

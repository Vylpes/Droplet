import { hash } from "bcryptjs";

export default class PasswordHelper {
    public static async GenerateRandomHashedPassword(): Promise<string> {
        const randomString = this.RandomString(8);

        const hashed = await hash(randomString, 10);

        return hashed;
    }

    public static async GenerateRandomHashedToken(): Promise<string> {
        const randomString = this.RandomString(32);

        const hashed = await hash(randomString, 10);

        return hashed;
    }

    private static RandomString(length: number) {
        let result: string;

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;

        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }
}
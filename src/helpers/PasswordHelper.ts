import { hash } from "bcryptjs";

export default class PasswordHelper {
    public static async GenerateRandomHashedPassword(): Promise<string> {
        const randomString = this.RandomString();

        const hashed = await hash(randomString, 10);

        return hashed;
    }

    private static RandomString() {
        let result: string;

        const length = 8;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;

        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }
}
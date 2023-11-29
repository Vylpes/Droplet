import User from "../contracts/entities/User/User";

declare module 'express-session' {
    interface Session {
        User?: User;
        error?: string;
        success?: string;
        code?: number;
    }
}
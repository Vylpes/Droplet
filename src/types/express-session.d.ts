import { User } from "../database/entities/User";

declare module 'express-session' {
    interface Session {
        User?: User;
        error?: string;
        success?: string;
        code?: number;
    }
}
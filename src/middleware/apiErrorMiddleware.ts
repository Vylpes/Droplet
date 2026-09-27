import { Request, Response, NextFunction } from "express";
import { GenerateResponse } from "../contracts/IBasicResponse";

export function ApiErrorMiddleware(err: any, req: Request, res: Response, _next: NextFunction) {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json(GenerateResponse(false, message));
}

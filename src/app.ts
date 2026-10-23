import "reflect-metadata";
import { Express, Request, Response, NextFunction } from "express";

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import * as dotenv from "dotenv";
import { readFileSync } from "fs";
import Session from "./database/entities/Session";
import { TypeormStore } from "typeorm-store";
import AppDataSource from "./database/dataSources/appDataSource";

import ApiRouter from "./routes/api";
import { ApiErrorMiddleware } from "./middleware/apiErrorMiddleware";
import { GenerateResponse } from "./contracts/IBasicResponse";

export class App {
    private _app: Express;
    private _apiRouter: ApiRouter;
    private readonly _frontendDist = path.join(process.cwd(), "frontend/dist");

    constructor() {
        this._app = express();
        this._apiRouter = new ApiRouter();
    }

    public async Start() {
        await this.SetupApp();
        this.SetupRoutes();
        this.SetupSpa();
        this.SetupErrors();
        this.SetupListen();
    }

    private async SetupApp() {
        dotenv.config();

        const expressSessionSecret = process.env.EXPRESS_SECRET || readFileSync(`${process.cwd()}/secret.txt`).toString();

        this._app.use(logger('dev'));
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: false }));
        this._app.use(cookieParser());

        await AppDataSource.initialize()
            .then(() => console.log("Data Source Initialized"))
            .catch(err => console.error("Error Initialising Data Source", err));

        // Session
        const sessionRepository = AppDataSource.getRepository(Session);

        // SPA (#346/#358): same-origin Express (prod) / Vite `/api` proxy (dev).
        // SameSite=Lax + httpOnly cookies; CSRF middleware not required for same-site POSTs.
        // Avoid SameSite=None / cross-origin CORS credentials — keep the Vite proxy instead.
        if (process.env.NODE_ENV === "production") {
            this._app.set("trust proxy", 1);
        }

        this._app.use(session({
            resave: false, // don't save session if unmodified
            saveUninitialized: false, // don't create session until something stored
            secret: expressSessionSecret,
            store: new TypeormStore({ repository: sessionRepository }),
            cookie: {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production"
            }
        }) as unknown as express.RequestHandler);
    }

    private SetupRoutes() {
        this._app.use('/api', this._apiRouter.Route());

        // Unmatched /api requests stay JSON (do not fall through to the SPA).
        this._app.use('/api', (_req: Request, res: Response) => {
            res.status(404).json(GenerateResponse(false, "Not found"));
        });
    }

    private SetupSpa() {
        // Built React assets (yarn build:frontend → frontend/dist)
        this._app.use(express.static(this._frontendDist));

        // Client-side routes: serve index.html for any non-file GET
        this._app.get("/{*path}", (_req: Request, res: Response) => {
            res.sendFile(path.join(this._frontendDist, "index.html"));
        });
    }

    private SetupErrors() {
        this._app.use('/api', ApiErrorMiddleware);

        this._app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
            if (req.path.startsWith('/api')) {
                return ApiErrorMiddleware(err, req, res, next);
            }

            const status = err.status || err.statusCode || 500;
            const message = err.message || "Internal Server Error";

            if (req.accepts("json") && !req.accepts("html")) {
                res.status(status).json(GenerateResponse(false, message));
                return;
            }

            // Prefer SPA shell so the React error page can render when useful
            res.status(status);
            res.sendFile(path.join(this._frontendDist, "index.html"), sendErr => {
                if (sendErr) {
                    res.type("text").send(message);
                }
            });
        });
    }

    private SetupListen() {
        this._app.listen(process.env.EXPRESS_PORT, () => {
            console.log(`Droplet listening at http://localhost:${process.env.EXPRESS_PORT}`);
        });
    }
}

import "reflect-metadata";
import { Express, Request, Response, NextFunction } from "express";
import { PugMiddleware } from "./middleware/pugMiddleware";

import express from "express";
import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import * as dotenv from "dotenv";

import { AuthRouter } from "./routes/auth";
import { DashboardRouter } from "./routes/dashboard";
import { IndexRouter } from "./routes";
import UserRouter from "./routes/user";
import ItemsRouter from "./routes/ItemsRouter";

export class App {
    private _app: Express;

    private _authRouter: AuthRouter;
    private _dashboardRouter: DashboardRouter;
    private _indexRouter: IndexRouter;
    private _userRouter: UserRouter;
    private _itemsRouter: ItemsRouter;

    constructor() {
        this._app = express();

        this._authRouter = new AuthRouter();
        this._dashboardRouter = new DashboardRouter();
        this._indexRouter = new IndexRouter();
        this._userRouter = new UserRouter();
        this._itemsRouter = new ItemsRouter();
    }

    public Start(port: number) {
        this.SetupApp();
        this.SetupRoutes();
        this.SetupErrors();
        this.SetupListen(port);
    }

    private SetupApp() {
        dotenv.config();

        this._app.set('views', path.join(process.cwd(), 'views'));
        this._app.set('view engine', 'pug');

        this._app.use(logger('dev'));
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: false }));
        this._app.use(cookieParser());
        this._app.use(express.static(path.join(process.cwd(), 'public')));
        this._app.use(session({
            resave: false, // don't save session if unmodified
            saveUninitialized: false, // don't create session until something stored
            secret: process.env.EXPRESS_SESSION_SECRET,
        }));

        // Session-persisted message middleware
        this._app.use(function(req, res, next){
            var err = req.session.error;
            var msg = req.session.success;
            delete req.session.error;
            delete req.session.success;
            if (err) res.locals.error = err;
            if (msg) res.locals.message = msg;
            next();
        });

        this._app.use(PugMiddleware.GetBaseString);
    }

    private SetupRoutes() {
        this._app.use('/', this._indexRouter.Route());
        this._app.use('/auth', this._authRouter.Route());
        this._app.use('/dashboard', this._dashboardRouter.Route());
        this._app.use('/user', this._userRouter.Route());
        this._app.use('/items', this._itemsRouter.Route());
    }

    private SetupErrors() {
        // 404
        this._app.use(function(req: Request, res: Response, next: NextFunction) {
            next(createError(404));
        });

        // Error Handler
        this._app.use(function(err: any, req: Request, res: Response) {
            // Set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // Render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }

    private SetupListen(port: number) {
        this._app.listen(port, () => {
            console.log(`Droplet listening at http://localhost:${port}`);
        });
    }
}

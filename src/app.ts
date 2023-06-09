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
import { readFileSync } from "fs";
import { getConnection } from "typeorm";
import Session from "./entity/Session";
import { TypeormStore } from "typeorm-store";
import connectFlash from "connect-flash";

import { AuthRouter } from "./routes/auth";
import { DashboardRouter } from "./routes/dashboard";
import { IndexRouter } from "./routes";
import SettingsRouter from "./routes/settingsRouter";
import ItemsRouter from "./routes/itemsRouter";
import ItemPurchasesRouter from "./routes/itemPurchasesRouter";
import SuppliesRouters from "./routes/suppliesRouter";
import SupplyPurchasesRouter from "./routes/SupplyPurchasesRouter";
import ListingsRouter from "./routes/listingsRouter";
import OrdersRouter from "./routes/ordersRouter";
import StorageRouter from "./routes/storageRouter";
import ReturnsRouter from "./routes/ReturnsRouter";
import PostagePolicyRouter from "./routes/postagePolicyRouter";

export class App {
    private _app: Express;

    private _authRouter: AuthRouter;
    private _dashboardRouter: DashboardRouter;
    private _indexRouter: IndexRouter;
    private _settingsRouter: SettingsRouter;
    private _itemsRouter: ItemsRouter;
    private _itemPurchaseRouter: ItemPurchasesRouter;
    private _suppliesRouter: SuppliesRouters;
    private _supplyPurchasesRouter: SupplyPurchasesRouter;
    private _listingsRouter: ListingsRouter;
    private _ordersRouter: OrdersRouter;
    private _storageRouter: StorageRouter;
    private _returnsRouter: ReturnsRouter;
    private _postagePolicyRouter: PostagePolicyRouter;

    constructor() {
        this._app = express();

        this._authRouter = new AuthRouter();
        this._dashboardRouter = new DashboardRouter();
        this._indexRouter = new IndexRouter();
        this._settingsRouter = new SettingsRouter();
        this._itemsRouter = new ItemsRouter();
        this._itemPurchaseRouter = new ItemPurchasesRouter();
        this._suppliesRouter = new SuppliesRouters();
        this._supplyPurchasesRouter = new SupplyPurchasesRouter();
        this._listingsRouter = new ListingsRouter();
        this._ordersRouter = new OrdersRouter();
        this._storageRouter = new StorageRouter();
        this._returnsRouter = new ReturnsRouter();
        this._postagePolicyRouter = new PostagePolicyRouter();
    }

    public Start() {
        this.SetupApp();
        this.SetupRoutes();
        this.SetupErrors();
        this.SetupListen();
    }

    private SetupApp() {
        dotenv.config();

        const expressSessionSecret = readFileSync(`${process.cwd()}/secret.txt`).toString();

        this._app.set('views', path.join(process.cwd(), 'views'));
        this._app.set('view engine', 'pug');

        this._app.use(logger('dev'));
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: false }));
        this._app.use(cookieParser());
        this._app.use(express.static(path.join(process.cwd(), 'public')));

        // Session
        const sessionRepository = getConnection().getRepository(Session);

        this._app.use(session({
            resave: false, // don't save session if unmodified
            saveUninitialized: false, // don't create session until something stored
            secret: expressSessionSecret,
            store: new TypeormStore({ repository: sessionRepository }),
        }));

        this._app.use(connectFlash());

        this._app.use(PugMiddleware.GetBaseString);
    }

    private SetupRoutes() {
        this._app.use('/', this._indexRouter.Route());
        this._app.use('/auth', this._authRouter.Route());
        this._app.use('/dashboard', this._dashboardRouter.Route());
        this._app.use('/settings', this._settingsRouter.Route());
        this._app.use('/items', this._itemsRouter.Route());
        this._app.use('/item-purchases', this._itemPurchaseRouter.Route());
        this._app.use('/supplies', this._suppliesRouter.Route());
        this._app.use('/supply-purchases', this._supplyPurchasesRouter.Route());
        this._app.use('/listings', this._listingsRouter.Route());
        this._app.use('/orders', this._ordersRouter.Route());
        this._app.use('/storage', this._storageRouter.Route());
        this._app.use('/returns/', this._returnsRouter.Route());
        this._app.use('/postage-policies', this._postagePolicyRouter.Route());
    }

    private SetupErrors() {
        // Error Handler
        this._app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
            // Set locals, only providing error in development
            const info = err.message;
            const error = req.app.get('env') === 'development' ? err : {};
            const showDetails = req.app.get('env') === 'development';

            // Render the error page
            res.status(err.status || 500);
            res.render('error', {
                info: info,
                error: error,
                status: err.status || 500,
                showDetails: showDetails,
            });
        });
    }

    private SetupListen() {
        this._app.listen(process.env.EXPRESS_PORT, () => {
            console.log(`Droplet listening at http://localhost:${process.env.EXPRESS_PORT}`);
        });
    }
}

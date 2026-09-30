import { NextFunction, Router, Request, Response } from "express";
import Page from "./Page";
import { ApiUserMiddleware } from "../middleware/apiUserMiddleware";

export default class ApiRoute {
    private _router: Router;
    private _pages: { path: string, page: Page, authorise: boolean, adminAuthorise: boolean }[];
    private _subRoutes: { path: string, route: ApiRoute }[];

    private _authorise: boolean;
    private _adminAuthorise: boolean;

    constructor(authorise: boolean = false, adminAuthorise: boolean = false) {
        this._router = Router();
        this._pages = [];
        this._subRoutes = [];

        this._authorise = authorise;
        this._adminAuthorise = adminAuthorise;
    }

    get router() {
        return this._router;
    }

    public AddPage(path: string, page: Page, authorise: boolean = false, adminAuthorise: boolean = false) {
        this._pages.push({ path, page, authorise, adminAuthorise });
    }

    public AddSubRoute(path: string, route: ApiRoute) {
        this._subRoutes.push({ path, route });
    }

    Route(): Router {
        for (const page of this._pages) {
            if (page.page.OnGet) {
                this._router.get(
                    page.path,
                    (req, res, next) => this.DoAuthorise(this._authorise || page.authorise, req, res, next),
                    (req, res, next) => this.DoAdminAuthorise(this._adminAuthorise || page.adminAuthorise, req, res, next),
                    page.page.OnGet
                );
            } else if (page.page.OnGetAsync) {
                this._router.get(
                    page.path,
                    (req, res, next) => this.DoAuthorise(this._authorise || page.authorise, req, res, next),
                    (req, res, next) => this.DoAdminAuthorise(this._adminAuthorise || page.adminAuthorise, req, res, next),
                    page.page.OnGetAsync
                );
            }

            if (page.page.OnPost) {
                this._router.post(
                    page.path,
                    (req, res, next) => this.DoAuthorise(this._authorise || page.authorise, req, res, next),
                    (req, res, next) => this.DoAdminAuthorise(this._adminAuthorise || page.adminAuthorise, req, res, next),
                    page.page.OnPost
                );
            } else if (page.page.OnPostAsync) {
                this._router.post(
                    page.path,
                    (req, res, next) => this.DoAuthorise(this._authorise || page.authorise, req, res, next),
                    (req, res, next) => this.DoAdminAuthorise(this._adminAuthorise || page.adminAuthorise, req, res, next),
                    page.page.OnPostAsync
                );
            }
        }

        for (const subRoute of this._subRoutes) {
            this._router.use(subRoute.path, subRoute.route.Route());
        }

        return this._router;
    }

    private DoAuthorise(authorise: boolean, req: Request, res: Response, next: NextFunction) {
        if (authorise) {
            ApiUserMiddleware.Authorise(req, res, next);
        } else {
            next();
        }
    }

    private DoAdminAuthorise(adminAuthorise: boolean, req: Request, res: Response, next: NextFunction) {
        if (adminAuthorise) {
            ApiUserMiddleware.AdminAuthorise(req, res, next);
        } else {
            next();
        }
    }
}

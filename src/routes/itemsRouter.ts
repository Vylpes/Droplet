import { Router } from "express";
import { Route } from "../contracts/Route";
import newPage from "./items/new";
import Update from "./items/update";
import view from "./items/view";

export default class ItemsRouter extends Route {
    private create: newPage;
    private view: view;
    private update: Update;

    constructor() {
        super();

        this.create = new newPage(super.router);
        this.view = new view(super.router);
        this.update = new Update(super.router);
    }

    public Route(): Router {
        this.create.Route();
        this.view.Route();
        this.update.Route();

        return this.router;
    }
}
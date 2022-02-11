import { Router } from "express";
import { Route } from "../contracts/Route";
import newPage from "./supplies/new";
import Update from "./supplies/update";
import view from "./supplies/view";

export default class SuppliesRouters extends Route {
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
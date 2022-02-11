import { Router } from "express";
import { Route } from "../contracts/Route";
import AssignItem from "./listings/assignItem";
import End from "./listings/end";
import list from "./listings/list";
import newPage from "./listings/new";
import Update from "./listings/update";
import view from "./listings/view";

export default class ListingsRouter extends Route {
    private list: list;
    private create: newPage;
    private view: view;
    private update: Update;
    private assignItem: AssignItem;
    private end: End;

    constructor() {
        super();

        this.list = new list(this.router);
        this.create = new newPage(super.router);
        this.view = new view(super.router);
        this.update = new Update(super.router);
        this.assignItem = new AssignItem(super.router);
        this.end = new End(super.router);
    }

    public Route(): Router {
        this.list.Route();
        this.create.Route();
        this.view.Route();
        this.update.Route();
        this.assignItem.Route();
        this.end.Route();

        return this.router;
    }
}
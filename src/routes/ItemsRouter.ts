import { Router } from "express";
import { Route } from "../contracts/Route";
import List from "./items/list";
import New from "./items/new";

export default class ItemsRouter extends Route {
    private list: List;
    private create: New;

    constructor() {
        super();

        this.list = new List(this.router);
        this.create = new New(super.router);
    }

    public Route(): Router {
        this.list.Route();
        this.create.Route();

        return this.router;
    }
}
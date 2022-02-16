import { Router } from "express";
import { Route } from "../contracts/Route";
import newPage from "./items/new";
import Update from "./items/update";
import UpdateQuantity from "./items/update-quantity";
import view from "./items/view";
import AssignItem from "./storage/assignItem";
import List from "./storage/list";
import New from "./storage/new";
import View from "./storage/view";

export default class StorageRouter extends Route {
    private list: List;
    private create: New;
    private view: View;
    private assignItem: AssignItem;

    constructor() {
        super();
        
        this.list = new List(super.router);
        this.create = new New(super.router);
        this.view = new View(super.router);
        this.assignItem = new AssignItem(super.router);
    }

    public Route(): Router {
        this.list.Route();
        this.create.Route();
        this.view.Route();
        this.assignItem.Route();

        return this.router;
    }
}
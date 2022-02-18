import { Router } from "express";
import { Route } from "../contracts/Route";
import newPage from "./items/new";
import Update from "./returns/update";
import UpdateQuantity from "./items/update-quantity";
import Close from "./returns/close";
import List from "./returns/list";
import New from "./returns/new";
import Posted from "./returns/posted";
import Received from "./returns/received";
import Refund from "./returns/refund";
import View from "./returns/view";
import Started from "./returns/started";

export default class ReturnsRouter extends Route {
    private close: Close;
    private list: List;
    private create: New;
    private posted: Posted;
    private received: Received;
    private refund: Refund;
    private update: Update;
    private view: View;
    private started: Started;

    constructor() {
        super();
        
        this.close = new Close(super.router);
        this.list = new List(super.router);
        this.create = new New(super.router);
        this.posted = new Posted(super.router);
        this.received = new Received(super.router);
        this.refund = new Refund(super.router);
        this.update = new Update(super.router);
        this.view = new View(super.router);
        this.started = new Started(super.router);
    }

    public Route(): Router {
        this.close.Route();
        this.list.Route();
        this.create.Route();
        this.posted.Route();
        this.received.Route();
        this.refund.Route();
        this.update.Route();
        this.view.Route();
        this.started.Route();

        return this.router;
    }
}
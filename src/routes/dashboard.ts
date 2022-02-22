import { Router } from "express";
import { Route } from "../contracts/Route";
import Calculator from "./dashboard/calculator";
import { Index } from "./dashboard/index";

export class DashboardRouter extends Route {
    private _index: Index;
    private calculator: Calculator;

    constructor() {
        super();

        this._index = new Index(super.router);
        this.calculator = new Calculator(super.router);
    }

    public Route(): Router {
        this._index.Route();
        this.calculator.Route();

        return super.router;
    }
}
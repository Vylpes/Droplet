import ApiRoute from "../../contracts/ApiRoute";
import DashboardRouter from "./dashboard";
import SettingsRouter from "./settings";
import ItemsRouter from "./items";
import ItemPurchasesRouter from "./itemPurchases";
import SuppliesRouter from "./supplies";
import SupplyPurchasesRouter from "./supplyPurchases";
import ListingsRouter from "./listings";
import OrdersRouter from "./orders";
import ReturnsRouter from "./returns";
import StorageRouter from "./storage";
import PostagePolicyRouter from "./postagePolicy";

export default class ApiRouter extends ApiRoute {
    constructor() {
        super(false);

        this.AddSubRoute("/dashboard", new DashboardRouter());
        this.AddSubRoute("/settings", new SettingsRouter());
        this.AddSubRoute("/items", new ItemsRouter());
        this.AddSubRoute("/item-purchases", new ItemPurchasesRouter());
        this.AddSubRoute("/supplies", new SuppliesRouter());
        this.AddSubRoute("/supply-purchases", new SupplyPurchasesRouter());
        this.AddSubRoute("/listings", new ListingsRouter());
        this.AddSubRoute("/orders", new OrdersRouter());
        this.AddSubRoute("/returns", new ReturnsRouter());
        this.AddSubRoute("/storage", new StorageRouter());
        this.AddSubRoute("/postage-policies", new PostagePolicyRouter());
    }
}

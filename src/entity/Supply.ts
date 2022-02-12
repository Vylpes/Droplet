import { Column, Entity, getConnection, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { ItemStatus } from "../constants/ItemStatus";
import { SupplyStatus } from "../constants/SupplyStatus";
import BaseEntity from "../contracts/BaseEntity";
import { Order } from "./Order";
import { SupplyPurchase } from "./SupplyPurchase";

@Entity()
export class Supply extends BaseEntity {
    constructor(name: string, sku: string, quantity: number) {
        super();

        this.Id = uuid();
        this.Name = name;
        this.Sku = sku;
        this.Quantity = quantity;
        this.StartingQuantity = quantity;
        this.Status = SupplyStatus.Unused;
        this.BuyPrice = -1;
        this.SellPrice = -1;
    }

    @PrimaryColumn()
    Id: string;

    @Column()
    Name: string;

    @Column()
    Sku: string;

    @Column()
    Quantity: number;

    @Column()
    StartingQuantity: number;
    
    @Column()
    Status: SupplyStatus;

    @Column("decimal", { precision: 20, scale: 2 })
    BuyPrice: number;

    @Column("decimal", { precision: 20, scale: 2 })
    SellPrice: number;

    @ManyToOne(_ => SupplyPurchase, purchase => purchase.Supplies)
    Purchase: SupplyPurchase;

    @ManyToOne(_ => Order, order => order.Supplies)
    Order: Order;

    public EditBasicDetails(name: string, sku: string) {
        this.Name = name;
        this.Sku = sku;

        this.WhenUpdated = new Date();
    }

    public AddStock(amount: number) {
        this.Quantity += amount;

        this.WhenUpdated = new Date();
    }

    public RemoveStock(amount: number) {
        if (amount > this.Quantity) return;

        this.Quantity -= amount;

        if (this.Quantity == 0) {
            this.Status = SupplyStatus.Used;
        }

        this.WhenUpdated = new Date();
    }

    public SetStock(amount: number) {
        if (amount < 0) return;

        this.Quantity = amount;

        this.WhenUpdated = new Date();
    }

    public UpdateStatus(status: SupplyStatus) {
        this.Status = status;

        this.WhenUpdated = new Date();
    }

    public SetBuyPrice(price: number) {
        this.BuyPrice = price;

        this.WhenUpdated = new Date();
    }

    public SetSellPrice(price: number) {
        this.SellPrice = price;

        this.WhenUpdated = new Date();
    }

    public AssignToPurchase(purchase: SupplyPurchase) {
        this.Purchase = purchase;

        this.WhenUpdated = new Date();
    }
}
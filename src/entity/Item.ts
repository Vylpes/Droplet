import { Column, Entity, getConnection, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { ItemStatus } from "../constants/ItemStatus";
import BaseEntity from "../contracts/BaseEntity";
import { Purchase } from "./Purchase";

@Entity()
export class Item extends BaseEntity {
    constructor(name: string, sku: string, quantity: number, status: ItemStatus, buyPrice: number = -1, sellPrice: number = -1) {
        super();

        this.Id = uuid();
        this.Name = name;
        this.Sku = sku;
        this.Quantity = quantity;
        this.Status = status;
        this.BuyPrice = buyPrice;
        this.SellPrice = sellPrice;

        this.WhenCreated = new Date();
        this.WhenUpdated = new Date();
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
    Status: ItemStatus;

    @Column("decimal", { precision: 20, scale: 2 })
    BuyPrice: number;

    @Column("decimal", { precision: 20, scale: 2 })
    SellPrice: number;

    @Column()
    WhenCreated: Date;

    @Column()
    WhenUpdated: Date;

    @ManyToOne(_ => Purchase, purchase => purchase.Items)
    Purchase: Purchase;

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

        this.WhenUpdated = new Date();
    }

    public SetStock(amount: number) {
        if (amount < 0) return;

        this.Quantity = amount;

        this.WhenUpdated = new Date();
    }

    public UpdateStatus(status: ItemStatus) {
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

    public AssignToPurchase(purchase: Purchase) {
        this.Purchase = purchase;

        this.WhenUpdated = new Date();
    }
}
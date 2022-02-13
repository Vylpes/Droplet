import { Column, Entity, getConnection, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
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
        this.UnusedQuantity = quantity;
        this.Status = SupplyStatus.Unused;

        this.BuyPrice = 0;
        this.UsedQuantity = 0;
    }

    @PrimaryColumn()
    Id: string;

    @Column()
    Name: string;

    @Column()
    Sku: string;

    @Column()
    UnusedQuantity: number;

    @Column()
    UsedQuantity: number;
    
    @Column()
    Status: SupplyStatus;

    @Column("decimal", { precision: 20, scale: 2 })
    BuyPrice: number;

    @ManyToOne(_ => SupplyPurchase, purchase => purchase.Supplies)
    Purchase: SupplyPurchase;

    @ManyToMany(_ => Order)
    Orders: Order[];

    public EditBasicDetails(name: string, sku: string) {
        this.Name = name;
        this.Sku = sku;

        this.WhenUpdated = new Date();
    }

    public AddStock(amount: number) {
        this.UnusedQuantity = Number(this.UnusedQuantity) + Number(amount);
        this.Status = SupplyStatus.Unused;

        this.WhenUpdated = new Date();
    }

    public RemoveStock(amount: number) {
        if (amount > this.UnusedQuantity) return;

        this.UnusedQuantity = Number(this.UnusedQuantity) - Number(amount);
        this.UsedQuantity = Number(this.UsedQuantity) + Number(amount);

        if (this.UnusedQuantity == 0) {
            this.Status = SupplyStatus.Used;
        }

        this.WhenUpdated = new Date();
    }

    public SetStock(unused: number, used: number) {
        this.UnusedQuantity = unused;
        this.UsedQuantity = used;

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

    public AssignToPurchase(purchase: SupplyPurchase) {
        this.Purchase = purchase;

        this.WhenUpdated = new Date();
    }
}
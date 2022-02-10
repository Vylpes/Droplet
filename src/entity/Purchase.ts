import { Column, Entity, getConnection, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { ItemStatus } from "../constants/ItemStatus";
import { PurchaseStatus } from "../constants/PurchaseStatus";
import BaseEntity from "../contracts/BaseEntity";
import { Item } from "./Item";

@Entity()
export class Purchase extends BaseEntity {
    constructor(description: string, price: number) {
        super();

        this.Id = uuid();
        this.Description = description;
        this.Status = PurchaseStatus.Ordered;
        this.Price = price;

        this.WhenCreated = new Date();
        this.WhenUpdated = new Date();
    }

    @PrimaryColumn()
    Id: string;

    @Column()
    Description: string;

    @Column()
    Status: PurchaseStatus;

    @Column("decimal", { precision: 20, scale: 2 })
    Price: number

    @Column()
    WhenCreated: Date;

    @Column()
    WhenUpdated: Date;

    @OneToMany(_ => Item, item => item.Purchase)
    Items: Item[];

    public UpdateBasicDetails(description: string, price: number) {
        this.Description = description;
        this.Price = price;

        this.WhenUpdated = new Date();
    }

    public UpdateStatus(status: PurchaseStatus) {
        this.Status = status;

        this.WhenUpdated = new Date();
    }

    public AddItemToOrder(item: Item) {
        this.Items.push(item);

        this.WhenUpdated = new Date();
    }
}
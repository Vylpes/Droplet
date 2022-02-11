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
    }

    public UpdateStatus(status: PurchaseStatus) {
        this.Status = status;
    }

    public AddItemToOrder(item: Item) {
        this.Items.push(item);
    }

    public async CalculateItemPrices() {
        if (!this.Items) return;

        const pricePerItem = this.Price / this.Items.length;

        for (const item of this.Items) {
            item.BuyPrice = pricePerItem;

            await item.Save(Item, item);
        }
    }
}
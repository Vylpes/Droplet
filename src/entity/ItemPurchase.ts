import { Column, Entity, getConnection, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { ItemStatus } from "../constants/ItemStatus";
import { ItemPurchaseStatus } from "../constants/ItemPurchaseStatus";
import BaseEntity from "../contracts/BaseEntity";
import { Item } from "./Item";

@Entity()
export class ItemPurchase extends BaseEntity {
    constructor(description: string, price: number) {
        super();

        this.Id = uuid();
        this.Description = description;
        this.Status = ItemPurchaseStatus.Ordered;
        this.Price = price;
    }

    @PrimaryColumn()
    Id: string;

    @Column()
    Description: string;

    @Column()
    Status: ItemPurchaseStatus;

    @Column("decimal", { precision: 20, scale: 2 })
    Price: number

    @OneToMany(_ => Item, item => item.Purchase)
    Items: Item[];

    public UpdateBasicDetails(description: string, price: number) {
        this.Description = description;
        this.Price = price;
    }

    public UpdateStatus(status: ItemPurchaseStatus) {
        this.Status = status;
    }

    public AddItemToOrder(item: Item) {
        this.Items.push(item);
    }

    public async CalculateItemPrices() {
        if (!this.Items) return;

        const pricePerItem = this.Price / this.Items.length;

        for (const item of this.Items) {
            item.BuyPrice = pricePerItem / item.StartingQuantity;

            await item.Save(Item, item);
        }
    }
}
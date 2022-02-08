import { Column, Entity, getConnection, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { ItemStatus } from "../constants/ItemStatus";

@Entity()
export class Item {
    constructor(name: string, sku: string, quantity: number, status: ItemStatus, buyPrice: number = -1, sellPrice: number = -1) {
        this.Id = uuid();
        this.Name = name;
        this.Sku = sku;
        this.Quantity = quantity;
        this.Status = status;
        this.BuyPrice = buyPrice;
        this.SellPrice = sellPrice;
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

    @Column("decimal", { precision: 20, scale: 2 })@Column()
    SellPrice: number;

    public EditBasicDetails(name: string, sku: string) {
        this.Name = name;
        this.Sku = sku;
    }

    public AddStock(amount: number) {
        this.Quantity += amount;
    }

    public RemoveStock(amount: number) {
        if (amount > this.Quantity) return;

        this.Quantity -= amount;
    }

    public UpdateStatus(status: ItemStatus) {
        this.Status = status;
    }

    public SetBuyPrice(price: number) {
        this.BuyPrice = price;
    }

    public SetSellPrice(price: number) {
        this.SellPrice = price;
    }

    public static async CreateItem(name: string, sku: string, quantity: number, status: ItemStatus, buyPrice?: number, sellPrice?: number): Promise<Item> {
        const connection = getConnection();

        const repo = connection.getRepository(Item);

        const item = new Item(name, sku, quantity, status, buyPrice, sellPrice);

        await repo.save(item);

        return item;
    }

    public static async GetAllItems(): Promise<Item[]> {
        const connection = getConnection();
        
        const repo = connection.getRepository(Item);

        const items = await repo.find();

        return items;
    }

    public static async GetItem(id: string): Promise<Item> {
        const connection = getConnection();

        const repo = connection.getRepository(Item);

        const item = await repo.findOne(id);

        return item;
    }

    public static async UpdateItemDetails(id: string, name: string, sku: string) {
        const connection = getConnection();

        const repo = connection.getRepository(Item);

        const item = await repo.findOne(id);

        if (!item) {
            return;
        }

        item.EditBasicDetails(name, sku);

        await repo.save(item);
    }

    public static async AddItemStock(id: string, amount: number) {
        const connection = getConnection();

        const repo = connection.getRepository(Item);

        const item = await repo.findOne(id);

        if (!item) {
            return;
        }

        item.AddStock(amount);

        await repo.save(item);
    }

    public static async RemoveItemStock(id: string, amount: number) {
        const connection = getConnection();

        const repo = connection.getRepository(Item);

        const item = await repo.findOne(id);

        if (!item) {
            return;
        }

        item.RemoveStock(amount);

        await repo.save(item);
    }

    public static async UpdateItemStatus(id: string, status: ItemStatus) {
        const connection = getConnection();

        const repo = connection.getRepository(Item);

        const item = await repo.findOne(id);

        if (!item) {
            return;
        }

        item.UpdateStatus(status);

        await repo.save(item);
    }

    public static async UpdateItemBuyPrice(id: string, price: number) {
        const connection = getConnection();

        const repo = connection.getRepository(Item);

        const item = await repo.findOne(id);

        if (!item) {
            return;
        }

        item.SetBuyPrice(price);

        await repo.save(item);
    }

    public static async UpdateItemSellPrice(id: string, price: number) {
        const connection = getConnection();

        const repo = connection.getRepository(Item);

        const item = await repo.findOne(id);

        if (!item) {
            return;
        }

        item.SetSellPrice(price);

        await repo.save(item);
    }
}
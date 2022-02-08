"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Item_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const ItemStatus_1 = require("../constants/ItemStatus");
let Item = Item_1 = class Item {
    constructor(name, sku, quantity, status, buyPrice = -1, sellPrice = -1) {
        this.Id = uuid_1.v4();
        this.Name = name;
        this.Sku = sku;
        this.Quantity = quantity;
        this.Status = status;
        this.BuyPrice = buyPrice;
        this.SellPrice = sellPrice;
    }
    EditBasicDetails(name, sku) {
        this.Name = name;
        this.Sku = sku;
    }
    AddStock(amount) {
        this.Quantity += amount;
    }
    RemoveStock(amount) {
        if (amount > this.Quantity)
            return;
        this.Quantity -= amount;
    }
    UpdateStatus(status) {
        this.Status = status;
    }
    SetBuyPrice(price) {
        this.BuyPrice = price;
    }
    SetSellPrice(price) {
        this.SellPrice = price;
    }
    static async CreateItem(name, sku, quantity, status, buyPrice, sellPrice) {
        const connection = typeorm_1.getConnection();
        const repo = connection.getRepository(Item_1);
        const item = new Item_1(name, sku, quantity, status, buyPrice, sellPrice);
        await repo.save(item);
        return item;
    }
    static async GetAllItems() {
        const connection = typeorm_1.getConnection();
        const repo = connection.getRepository(Item_1);
        const items = await repo.find();
        return items;
    }
    static async GetItem(id) {
        const connection = typeorm_1.getConnection();
        const repo = connection.getRepository(Item_1);
        const item = await repo.findOne(id);
        return item;
    }
    static async UpdateItemDetails(id, name, sku) {
        const connection = typeorm_1.getConnection();
        const repo = connection.getRepository(Item_1);
        const item = await repo.findOne(id);
        if (!item) {
            return;
        }
        item.EditBasicDetails(name, sku);
        await repo.save(item);
    }
    static async AddItemStock(id, amount) {
        const connection = typeorm_1.getConnection();
        const repo = connection.getRepository(Item_1);
        const item = await repo.findOne(id);
        if (!item) {
            return;
        }
        item.AddStock(amount);
        await repo.save(item);
    }
    static async RemoveItemStock(id, amount) {
        const connection = typeorm_1.getConnection();
        const repo = connection.getRepository(Item_1);
        const item = await repo.findOne(id);
        if (!item) {
            return;
        }
        item.RemoveStock(amount);
        await repo.save(item);
    }
    static async UpdateItemStatus(id, status) {
        const connection = typeorm_1.getConnection();
        const repo = connection.getRepository(Item_1);
        const item = await repo.findOne(id);
        if (!item) {
            return;
        }
        item.UpdateStatus(status);
        await repo.save(item);
    }
    static async UpdateItemBuyPrice(id, price) {
        const connection = typeorm_1.getConnection();
        const repo = connection.getRepository(Item_1);
        const item = await repo.findOne(id);
        if (!item) {
            return;
        }
        item.SetBuyPrice(price);
        await repo.save(item);
    }
    static async UpdateItemSellPrice(id, price) {
        const connection = typeorm_1.getConnection();
        const repo = connection.getRepository(Item_1);
        const item = await repo.findOne(id);
        if (!item) {
            return;
        }
        item.SetSellPrice(price);
        await repo.save(item);
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Item.prototype, "Id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Item.prototype, "Name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Item.prototype, "Sku", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Item.prototype, "Quantity", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Item.prototype, "Status", void 0);
__decorate([
    typeorm_1.Column("decimal", { precision: 20, scale: 2 }),
    __metadata("design:type", Number)
], Item.prototype, "BuyPrice", void 0);
__decorate([
    typeorm_1.Column("decimal", { precision: 20, scale: 2 }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Item.prototype, "SellPrice", void 0);
Item = Item_1 = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [String, String, Number, Number, Number, Number])
], Item);
exports.Item = Item;
//# sourceMappingURL=Item.js.map
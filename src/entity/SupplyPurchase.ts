import { Column, Entity, getConnection, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { ItemStatus } from "../constants/Status/ItemStatus";
import { SupplyPurchaseStatus } from "../constants/Status/SupplyPurchaseStatus";
import BaseEntity from "../contracts/BaseEntity";
import { Item } from "./Item";
import { Supply } from "./Supply";

@Entity()
export class SupplyPurchase extends BaseEntity {
    constructor(description: string, price: number) {
        super();

        this.Id = uuid();
        this.Description = description;
        this.Status = SupplyPurchaseStatus.Ordered;
        this.Price = price;
    }

    @PrimaryColumn()
    Id: string;

    @Column()
    Description: string;

    @Column()
    Status: SupplyPurchaseStatus;

    @Column("decimal", { precision: 20, scale: 2 })
    Price: number;

    @OneToMany(_ => Supply, item => item.Purchase)
    Supplies: Supply[];

    public UpdateBasicDetails(description: string, price: number) {
        this.Description = description;
        this.Price = price;
    }

    public UpdateStatus(status: SupplyPurchaseStatus) {
        this.Status = status;
    }

    public AddSupplyToOrder(supply: Supply) {
        this.Supplies.push(supply);
    }

    public async CalculateItemPrices() {
        if (!this.Supplies) return;

        const pricePerSupply = this.Price / this.Supplies.filter(x => (x.UnusedQuantity + x.UsedQuantity) != 0).length;

        for (const supply of this.Supplies) {
            const totalQuantity = supply.UnusedQuantity + supply.UsedQuantity;

            if (totalQuantity == 0) {
                supply.BuyPrice = 0;
            } else {
                supply.BuyPrice = pricePerSupply / (supply.UnusedQuantity + supply.UsedQuantity);
            }

            await supply.Save(Supply, supply);
        }
    }
}
import { Column, Entity, ManyToOne } from "typeorm";
import BaseEntity from "../../contracts/BaseEntity";
import { Supply } from "./Supply";
import { Order } from "./Order";

@Entity()
export class OrderSupply extends BaseEntity {
    constructor(quantity: number) {
        super();

        this.Quantity = quantity;
    }

    @Column()
    Quantity: number;

    @ManyToOne(() => Supply, x => x.Orders)
    Supply: Supply;

    @ManyToOne(() => Order, x => x.Supplies)
    Order: Order;

    public EditBasicDetails(quantity: number) {
        this.Quantity = quantity;
    }

    public AssignSupply(supply: Supply) {
        if (this.Supply) return;

        this.Supply = supply;
    }

    public AssignOrder(order: Order) {
        if (this.Order) return;

        this.Order = order;
    }
}
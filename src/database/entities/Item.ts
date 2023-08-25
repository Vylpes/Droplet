import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { ItemStatus, ItemStatusNames } from "../../constants/Status/ItemStatus";
import BaseEntity from "../../contracts/BaseEntity";
import { ItemPurchase } from "./ItemPurchase";
import { Listing } from "./Listing";
import { Storage } from "./Storage";

@Entity()
export class Item extends BaseEntity {
    constructor(name: string, quantity: number) {
        super();

        this.Id = uuid();
        this.Name = name;
        this.UnlistedQuantity = quantity;
        this.Status = ItemStatus.Unlisted;

        this.BuyPrice = 0;
        this.ListedQuantity = 0;
        this.SoldQuantity = 0;
        this.RejectedQuantity = 0;
        this.Sku = "";
    }

    @PrimaryColumn()
    Id: string;

    @Column()
    Name: string;

    @Column()
    Sku: string;

    @Column()
    UnlistedQuantity: number;

    @Column()
    ListedQuantity: number;

    @Column()
    SoldQuantity: number;

    @Column()
    RejectedQuantity: number;

    @Column()
    Status: ItemStatus;

    StatusName = () => ItemStatusNames.get(this.Status);

    @Column("decimal", { precision: 20, scale: 2 })
    BuyPrice: number;

    @ManyToOne(_ => ItemPurchase, purchase => purchase.Items)
    Purchase: ItemPurchase;

    @ManyToMany(() => Listing)
    Listings: Listing[];

    @ManyToOne(() => Storage, storage => storage.Items)
    Storage?: Storage;

    public EditBasicDetails(name: string) {
        this.Name = name;

        this.WhenUpdated = new Date();
    }

    public EditQuantities(unlisted: number, listed: number, sold: number, rejected: number) {
        this.UnlistedQuantity = unlisted;
        this.ListedQuantity = listed;
        this.SoldQuantity = sold;
        this.RejectedQuantity = rejected;

        this.CalculateStatus();

        this.WhenUpdated = new Date();
    }

    public GenerateSku() {
        const buildingPrefix = this.Storage?.Parent?.Parent?.SkuPrefix || "";
        const unitPrefix = this.Storage?.Parent?.SkuPrefix || "";
        const binPrefix = this.Storage?.SkuPrefix || "";
        const itemCounter = this.Storage?.ItemCounter || 0;

        const itemCounterString = String(itemCounter);

        this.Sku = `${buildingPrefix}${unitPrefix}${binPrefix}-${itemCounterString.padStart(4, '0')}`
    }

    public UpdateStatus(status: ItemStatus) {
        this.Status = status;

        this.WhenUpdated = new Date();
    }

    public SetBuyPrice(price: number) {
        this.BuyPrice = price;

        this.WhenUpdated = new Date();
    }

    public AssignToPurchase(purchase: ItemPurchase) {
        this.Purchase = purchase;

        this.WhenUpdated = new Date();
    }

    public MarkAsUnlisted(amount: number, fromStatus: ItemStatus) {
        this.RemoveFromStatus(amount, fromStatus);
        this.UnlistedQuantity = Number(this.UnlistedQuantity) + Number(amount);

        this.CalculateStatus();

        this.WhenUpdated = new Date();
    }

    public MarkAsListed(amount: number, fromStatus: ItemStatus) {
        this.RemoveFromStatus(amount, fromStatus);
        this.ListedQuantity = Number(this.ListedQuantity) + Number(amount);

        this.CalculateStatus();

        this.WhenUpdated = new Date();
    }

    public MarkAsSold(amount: number, fromStatus: ItemStatus) {
        this.RemoveFromStatus(amount, fromStatus);
        this.SoldQuantity = Number(this.SoldQuantity) + Number(amount);

        this.CalculateStatus();

        this.WhenUpdated = new Date();
    }

    public MarkAsRejected(amount: number, fromStatus: ItemStatus) {
        this.RemoveFromStatus(amount, fromStatus);
        this.RejectedQuantity = Number(this.RejectedQuantity) + Number(amount);

        this.CalculateStatus();

        this.WhenUpdated = new Date();
    }

    public SetStorageBin(storage: Storage) {
        this.Storage = storage;
    }

    private RemoveFromStatus(amount: number, fromStatus: ItemStatus) {
        switch (fromStatus) {
            case ItemStatus.Unlisted:
                if (this.UnlistedQuantity < amount) return;
                this.UnlistedQuantity = Number(this.UnlistedQuantity) - Number(amount);
                break;
            case ItemStatus.Listed:
                if (this.ListedQuantity < amount) return;
                this.ListedQuantity = Number(this.ListedQuantity) - Number(amount);
                break;
            case ItemStatus.Sold:
                if (this.SoldQuantity < amount) return;
                this.SoldQuantity = Number(this.SoldQuantity) - Number(amount);
                break;
            case ItemStatus.Rejected:
                if (this.RejectedQuantity < amount) return;
                this.RejectedQuantity = Number(this.RejectedQuantity) - Number(amount);
                break;
            default:
                return;
        }
    }

    private CalculateStatus() {
        if (this.UnlistedQuantity > 0) {
            this.Status = ItemStatus.Unlisted;
        } else if (this.ListedQuantity > 0) {
            this.Status = ItemStatus.Listed;
        } else if (this.SoldQuantity > 0) {
            this.Status = ItemStatus.Sold;
        } else if (this.RejectedQuantity > 0) {
            this.Status = ItemStatus.Rejected;
        } else {
            this.Status = ItemStatus.Rejected;
        }
    }
}
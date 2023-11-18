CREATE TABLE listing_item (
    Id varchar(255) NOT NULL,
    WhenCreated datetime NOT NULL,
    WhenUpdated datetime NOT NULL,
    Quantity int NOT NULL,
    itemId varchar(255) DEFAULT NULL,
    listingId varchar(255) DEFAULT NULL,
);
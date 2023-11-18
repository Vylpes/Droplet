CREATE TABLE order_listing (
    Id varchar(255) NOT NULL,
    WhenCreated datetime NOT NULL,
    WhenUpdated datetime NOT NULL,
    Quantity int NOT NULL,
    listingId varchar(255) DEFAULT NULL,
    orderId varchar(255) DEFAULT NULL
);
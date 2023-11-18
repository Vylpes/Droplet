INSERT INTO item_listing (
    Id,
    WhenCreated,
    WhenUpdated,
    Quantity,
    itemId,
    listingId
)
SELECT
    UUID(),
    NOW(),
    NOW(),
    0,
    itemId,
    listingId
FROM listing_items_item;
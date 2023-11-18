INSERT INTO listing_item (
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
    1,
    itemId,
    listingId
FROM listing_items_item;
INSERT INTO order_listing (
    Id,
    WhenCreated,
    WhenUpdated,
    Quantity,
    listingId,
    orderId
)
SELECT
    UUID(),
    NOW(),
    NOW(),
    0,
    listingId,
    orderId
FROM order_listings_listing
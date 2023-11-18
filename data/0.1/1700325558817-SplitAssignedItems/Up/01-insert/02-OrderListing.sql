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
    1,
    listingId,
    orderId
FROM order_listings_listing
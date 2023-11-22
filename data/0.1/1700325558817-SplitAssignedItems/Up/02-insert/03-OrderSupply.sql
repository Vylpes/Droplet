INSERT INTO order_supply (
    Id,
    WhenCreated,
    WhenUpdated,
    Quantity,
    supplyId,
    orderId
)
SELECT
    UUID(),
    NOW(),
    NOW(),
    1,
    supplyId,
    orderId
FROM order_supplies_supply;
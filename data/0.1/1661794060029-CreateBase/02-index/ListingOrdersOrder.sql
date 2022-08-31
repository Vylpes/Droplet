ALTER TABLE `listing_orders_order`
  ADD PRIMARY KEY (`listingId`,`orderId`),
  ADD KEY `IDX_7a3101f678e4356ac57234c55e` (`listingId`),
  ADD KEY `IDX_3285f57f18e4c1bd3004a87e90` (`orderId`);
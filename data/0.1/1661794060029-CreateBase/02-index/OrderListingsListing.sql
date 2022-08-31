ALTER TABLE `order_listings_listing`
  ADD PRIMARY KEY (`orderId`,`listingId`),
  ADD KEY `IDX_011b633bdec72ef3eddebc3efc` (`orderId`),
  ADD KEY `IDX_482aadb44a49dd6c81720bd4aa` (`listingId`);
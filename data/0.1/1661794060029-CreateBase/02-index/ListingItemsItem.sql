ALTER TABLE `listing_items_item`
  ADD PRIMARY KEY (`listingId`,`itemId`),
  ADD KEY `IDX_d813e1b4d013a00685904e2f88` (`listingId`),
  ADD KEY `IDX_39ccd343f673c21804a01928a0` (`itemId`);
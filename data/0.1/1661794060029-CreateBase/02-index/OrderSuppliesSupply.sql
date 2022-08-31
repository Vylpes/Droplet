ALTER TABLE `order_supplies_supply`
  ADD PRIMARY KEY (`orderId`,`supplyId`),
  ADD KEY `IDX_dbdecef5991f3b20d7f65710d5` (`orderId`),
  ADD KEY `IDX_2d6a6770f5ae9e325f8f185ba6` (`supplyId`);
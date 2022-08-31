ALTER TABLE `tracking_number`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_6bc8b7510cbf6518ea69e9ab90f` (`orderId`),
  ADD KEY `FK_aa64f6b6102a806bef872f101b0` (`returnId`);
ALTER TABLE `order`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_615ad584575e3dcb59f7f4202d3` (`postagePolicyId`),
  ADD KEY `FK_a0c2a81dbb89a3b887a7d0628f2` (`returnsId`);
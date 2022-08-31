ALTER TABLE `order`
  ADD CONSTRAINT `FK_615ad584575e3dcb59f7f4202d3` FOREIGN KEY (`postagePolicyId`) REFERENCES `postage_policy` (`Id`),
  ADD CONSTRAINT `FK_a0c2a81dbb89a3b887a7d0628f2` FOREIGN KEY (`returnsId`) REFERENCES `return` (`Id`);
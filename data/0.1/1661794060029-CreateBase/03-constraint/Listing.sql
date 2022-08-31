ALTER TABLE `listing`
  ADD CONSTRAINT `FK_df8b467b19c3530b2dbff4fb741` FOREIGN KEY (`postagePolicyId`) REFERENCES `postage_policy` (`Id`);
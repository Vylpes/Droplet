ALTER TABLE `tracking_number`
  ADD CONSTRAINT `FK_6bc8b7510cbf6518ea69e9ab90f` FOREIGN KEY (`orderId`) REFERENCES `order` (`Id`),
  ADD CONSTRAINT `FK_aa64f6b6102a806bef872f101b0` FOREIGN KEY (`returnId`) REFERENCES `return` (`Id`);
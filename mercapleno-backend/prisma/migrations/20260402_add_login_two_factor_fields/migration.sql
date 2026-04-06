ALTER TABLE `usuarios`
  ADD COLUMN `login_two_factor_code` VARCHAR(64) NULL AFTER `email_verification_expires`,
  ADD COLUMN `login_two_factor_expires` DATETIME(0) NULL AFTER `login_two_factor_code`;

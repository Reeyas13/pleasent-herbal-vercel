-- AlterTable
ALTER TABLE `user` ADD COLUMN `VerificationCode` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false;

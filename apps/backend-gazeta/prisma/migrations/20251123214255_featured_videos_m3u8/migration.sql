-- AlterTable
ALTER TABLE `videos` ADD COLUMN `available_qualities` TEXT NULL,
    ADD COLUMN `file_size` BIGINT NULL,
    ADD COLUMN `format` VARCHAR(10) NULL,
    ADD COLUMN `hls_ready` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hls_url` VARCHAR(500) NULL,
    ADD COLUMN `processing_error` TEXT NULL,
    ADD COLUMN `processing_status` VARCHAR(20) NULL;

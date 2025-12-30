/*
  Warnings:

  - You are about to drop the column `available_qualities` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `file_size` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `format` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `hls_ready` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `hls_url` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `processing_error` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `processing_status` on the `videos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `videos` DROP COLUMN `available_qualities`,
    DROP COLUMN `file_size`,
    DROP COLUMN `format`,
    DROP COLUMN `hls_ready`,
    DROP COLUMN `hls_url`,
    DROP COLUMN `processing_error`,
    DROP COLUMN `processing_status`,
    ADD COLUMN `featured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `tags` JSON NULL,
    ADD COLUMN `views` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `video_categories` (
    `video_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,

    INDEX `video_categories_category_id_fkey`(`category_id`),
    PRIMARY KEY (`video_id`, `category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `video_categories` ADD CONSTRAINT `video_categories_video_id_fkey` FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `video_categories` ADD CONSTRAINT `video_categories_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

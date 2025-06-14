/*
  Warnings:

  - You are about to drop the column `img_emphasis` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `img_emphasis_author` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `media` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `news` table. All the data in the column will be lost.
  - You are about to alter the column `published` on the `news` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(50)`.
  - Added the required column `update_at` to the `news` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `news` DROP COLUMN `img_emphasis`,
    DROP COLUMN `img_emphasis_author`,
    DROP COLUMN `media`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `update_at` DATETIME(3) NOT NULL,
    MODIFY `published` VARCHAR(50) NOT NULL DEFAULT 'false';

-- CreateTable
CREATE TABLE `news_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emphasis` BOOLEAN NOT NULL DEFAULT false,
    `img_size` JSON NULL,
    `author` VARCHAR(200) NULL,
    `date` VARCHAR(50) NULL,
    `news_id` INTEGER NOT NULL,

    INDEX `news_media_news_id_fkey`(`news_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news_video` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(500) NOT NULL,
    `thumbnail` VARCHAR(500) NOT NULL,
    `news_id` INTEGER NOT NULL,

    INDEX `news_video_news_id_fkey`(`news_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emphasis` BOOLEAN NOT NULL DEFAULT false,
    `img_size` JSON NULL,
    `author` VARCHAR(200) NULL,
    `date` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `news_media` ADD CONSTRAINT `news_media_news_id_fkey` FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news_video` ADD CONSTRAINT `news_video_news_id_fkey` FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `destaque_category_relations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `destaque_configs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `top_gazeta_category_relations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `top_gazeta_configs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `youtube_playlists` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `destaque_category_relations` DROP FOREIGN KEY `destaque_category_relations_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `destaque_category_relations` DROP FOREIGN KEY `destaque_category_relations_destaque_config_id_fkey`;

-- DropForeignKey
ALTER TABLE `destaque_configs` DROP FOREIGN KEY `destaque_configs_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `top_gazeta_category_relations` DROP FOREIGN KEY `top_gazeta_category_relations_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `top_gazeta_category_relations` DROP FOREIGN KEY `top_gazeta_category_relations_top_gazeta_config_id_fkey`;

-- DropForeignKey
ALTER TABLE `top_gazeta_configs` DROP FOREIGN KEY `top_gazeta_configs_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `youtube_playlists` DROP FOREIGN KEY `youtube_playlists_created_by_fkey`;

-- AlterTable
ALTER TABLE `videos` ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `featured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `newsSlug` VARCHAR(255) NULL,
    ADD COLUMN `tags` LONGTEXT NULL,
    ADD COLUMN `views` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `destaque_category_relations`;

-- DropTable
DROP TABLE `destaque_configs`;

-- DropTable
DROP TABLE `top_gazeta_category_relations`;

-- DropTable
DROP TABLE `top_gazeta_configs`;

-- DropTable
DROP TABLE `youtube_playlists`;

-- CreateTable
CREATE TABLE `video_categories` (
    `video_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,

    INDEX `video_categories_category_id_fkey`(`category_id`),
    PRIMARY KEY (`video_id`, `category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `top_categories_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(20) NOT NULL,
    `random_mode` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,

    INDEX `top_categories_configs_type_idx`(`type`),
    INDEX `top_categories_configs_created_by_idx`(`created_by`),
    UNIQUE INDEX `top_categories_configs_type_created_by_key`(`type`, `created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `top_categories_category_relations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `top_categories_config_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,

    INDEX `top_cat_rel_config_id_idx`(`top_categories_config_id`),
    INDEX `top_cat_rel_category_id_idx`(`category_id`),
    UNIQUE INDEX `top_cat_rel_unique_key`(`top_categories_config_id`, `category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(500) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `content_media_url_key`(`url`),
    INDEX `content_media_url_idx`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news_content_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `news_id` INTEGER NOT NULL,
    `content_media_id` INTEGER NOT NULL,

    INDEX `news_content_media_news_id_idx`(`news_id`),
    INDEX `news_content_media_content_media_id_idx`(`content_media_id`),
    UNIQUE INDEX `news_content_media_unique`(`news_id`, `content_media_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenance_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,

    INDEX `maintenance_configs_is_active_idx`(`is_active`),
    INDEX `maintenance_configs_created_by_idx`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carousel_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `featured_news_limit` INTEGER NOT NULL DEFAULT 5,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,

    INDEX `carousel_configs_created_by_idx`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `video_categories` ADD CONSTRAINT `video_categories_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `video_categories` ADD CONSTRAINT `video_categories_video_id_fkey` FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `top_categories_configs` ADD CONSTRAINT `top_cat_configs_user_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `top_categories_category_relations` ADD CONSTRAINT `top_cat_rel_category_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `top_categories_category_relations` ADD CONSTRAINT `top_cat_rel_config_fkey` FOREIGN KEY (`top_categories_config_id`) REFERENCES `top_categories_configs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news_content_media` ADD CONSTRAINT `news_content_media_news_id_fkey` FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news_content_media` ADD CONSTRAINT `news_content_media_content_media_id_fkey` FOREIGN KEY (`content_media_id`) REFERENCES `content_media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance_configs` ADD CONSTRAINT `maintenance_configs_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carousel_configs` ADD CONSTRAINT `carousel_configs_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

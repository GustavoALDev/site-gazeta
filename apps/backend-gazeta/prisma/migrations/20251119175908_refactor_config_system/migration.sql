/*
  Warnings:

  - You are about to drop the `home_category_configs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `home_category_configs` DROP FOREIGN KEY `home_category_configs_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `home_category_configs` DROP FOREIGN KEY `home_category_configs_created_by_fkey`;

-- DropTable
DROP TABLE `home_category_configs`;

-- CreateTable
CREATE TABLE `destaque_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `random_mode` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,

    UNIQUE INDEX `destaque_configs_created_by_key`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `destaque_category_relations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `destaque_config_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,

    INDEX `destaque_category_relations_destaque_config_id_idx`(`destaque_config_id`),
    INDEX `destaque_category_relations_category_id_idx`(`category_id`),
    UNIQUE INDEX `destaque_category_relations_destaque_config_id_category_id_key`(`destaque_config_id`, `category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `top_gazeta_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `random_mode` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,

    UNIQUE INDEX `top_gazeta_configs_created_by_key`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `top_gazeta_category_relations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `top_gazeta_config_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,

    INDEX `top_gazeta_category_relations_top_gazeta_config_id_idx`(`top_gazeta_config_id`),
    INDEX `top_gazeta_category_relations_category_id_idx`(`category_id`),
    UNIQUE INDEX `top_gazeta_category_relations_top_gazeta_config_id_category__key`(`top_gazeta_config_id`, `category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `section_order_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `section_id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `order` INTEGER NOT NULL,
    `show_title` BOOLEAN NOT NULL DEFAULT true,
    `icon` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,

    INDEX `section_order_configs_order_idx`(`order`),
    UNIQUE INDEX `section_order_configs_section_id_key`(`section_id`),
    UNIQUE INDEX `section_order_configs_order_key`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `social_media_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `instagram` VARCHAR(500) NULL,
    `facebook` VARCHAR(500) NULL,
    `youtube` VARCHAR(500) NULL,
    `linkedin` VARCHAR(500) NULL,
    `twitter` VARCHAR(500) NULL,
    `tiktok` VARCHAR(500) NULL,
    `whatsapp` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,

    UNIQUE INDEX `social_media_configs_created_by_key`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `destaque_configs` ADD CONSTRAINT `destaque_configs_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `destaque_category_relations` ADD CONSTRAINT `destaque_category_relations_destaque_config_id_fkey` FOREIGN KEY (`destaque_config_id`) REFERENCES `destaque_configs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `destaque_category_relations` ADD CONSTRAINT `destaque_category_relations_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `top_gazeta_configs` ADD CONSTRAINT `top_gazeta_configs_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `top_gazeta_category_relations` ADD CONSTRAINT `top_gazeta_category_relations_top_gazeta_config_id_fkey` FOREIGN KEY (`top_gazeta_config_id`) REFERENCES `top_gazeta_configs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `top_gazeta_category_relations` ADD CONSTRAINT `top_gazeta_category_relations_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `section_order_configs` ADD CONSTRAINT `section_order_configs_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `social_media_configs` ADD CONSTRAINT `social_media_configs_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

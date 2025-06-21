-- CreateTable
CREATE TABLE `home_category_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NOT NULL,
    `display_order` INTEGER NOT NULL,
    `is_visible` BOOLEAN NOT NULL DEFAULT true,
    `max_news` INTEGER NOT NULL DEFAULT 6,
    `show_title` BOOLEAN NOT NULL DEFAULT true,
    `custom_title` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,

    INDEX `home_category_config_order_visible_idx`(`display_order`, `is_visible`),
    INDEX `home_category_config_created_by_fkey`(`created_by`),
    UNIQUE INDEX `home_category_config_category_unique`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `home_category_configs` ADD CONSTRAINT `home_category_configs_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `home_category_configs` ADD CONSTRAINT `home_category_configs_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

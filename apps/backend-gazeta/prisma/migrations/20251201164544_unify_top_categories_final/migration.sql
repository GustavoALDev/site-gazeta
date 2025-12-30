/*
  Warnings:

  - You are about to drop the `destaque_category_relations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `destaque_configs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `top_gazeta_category_relations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `top_gazeta_configs` table. If the table is not empty, all the data it contains will be lost.

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

-- DropTable
DROP TABLE `destaque_category_relations`;

-- DropTable
DROP TABLE `destaque_configs`;

-- DropTable
DROP TABLE `top_gazeta_category_relations`;

-- DropTable
DROP TABLE `top_gazeta_configs`;

-- AddForeignKey
ALTER TABLE `top_categories_configs` ADD CONSTRAINT `top_categories_configs_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `top_categories_category_relations` ADD CONSTRAINT `top_categories_category_relations_top_categories_config_id_fkey` FOREIGN KEY (`top_categories_config_id`) REFERENCES `top_categories_configs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `top_categories_category_relations` ADD CONSTRAINT `top_categories_category_relations_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `top_categories_configs_created_by_idx` ON `top_categories_configs`(`created_by`);
DROP INDEX `top_cat_configs_created_by_idx` ON `top_categories_configs`;

-- RedefineIndex
CREATE INDEX `top_categories_configs_type_idx` ON `top_categories_configs`(`type`);
DROP INDEX `top_cat_configs_type_idx` ON `top_categories_configs`;

-- RedefineIndex
CREATE UNIQUE INDEX `top_categories_configs_type_created_by_key` ON `top_categories_configs`(`type`, `created_by`);
DROP INDEX `top_cat_configs_type_user_key` ON `top_categories_configs`;

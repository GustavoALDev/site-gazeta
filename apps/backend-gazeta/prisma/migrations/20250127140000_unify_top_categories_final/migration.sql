-- CreateTable: Nova tabela unificada para Top Categories
CREATE TABLE IF NOT EXISTS `top_categories_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(20) NOT NULL,
    `random_mode` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,

    UNIQUE INDEX `top_cat_configs_type_user_key`(`type`, `created_by`),
    INDEX `top_cat_configs_type_idx`(`type`),
    INDEX `top_cat_configs_created_by_idx`(`created_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: Nova tabela de relações
CREATE TABLE IF NOT EXISTS `top_categories_category_relations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `top_categories_config_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,

    INDEX `top_cat_rel_config_id_idx`(`top_categories_config_id`),
    INDEX `top_cat_rel_category_id_idx`(`category_id`),
    UNIQUE INDEX `top_cat_rel_unique_key`(`top_categories_config_id`, `category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Migrar dados de destaque_configs para top_categories_configs (PRIMARY)
SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'destaque_configs');
SET @sql = IF(@table_exists > 0,
    'INSERT INTO `top_categories_configs` (`type`, `random_mode`, `created_at`, `updated_at`, `created_by`)
     SELECT ''PRIMARY'', `random_mode`, `created_at`, `updated_at`, `created_by`
     FROM `destaque_configs`
     WHERE NOT EXISTS (
         SELECT 1 FROM `top_categories_configs` 
         WHERE `type` = ''PRIMARY'' AND `created_by` = `destaque_configs`.`created_by`
     )',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Migrar dados de top_gazeta_configs para top_categories_configs (SECONDARY)
SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'top_gazeta_configs');
SET @sql = IF(@table_exists > 0,
    'INSERT INTO `top_categories_configs` (`type`, `random_mode`, `created_at`, `updated_at`, `created_by`)
     SELECT ''SECONDARY'', `random_mode`, `created_at`, `updated_at`, `created_by`
     FROM `top_gazeta_configs`
     WHERE NOT EXISTS (
         SELECT 1 FROM `top_categories_configs` 
         WHERE `type` = ''SECONDARY'' AND `created_by` = `top_gazeta_configs`.`created_by`
     )',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Migrar relações de destaque_category_relations para top_categories_category_relations
SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'destaque_category_relations');
SET @sql = IF(@table_exists > 0,
    'INSERT INTO `top_categories_category_relations` (`top_categories_config_id`, `category_id`)
     SELECT 
         (SELECT `id` FROM `top_categories_configs` WHERE `type` = ''PRIMARY'' AND `created_by` = dc.`created_by` LIMIT 1),
         dcr.`category_id`
     FROM `destaque_category_relations` dcr
     INNER JOIN `destaque_configs` dc ON dcr.`destaque_config_id` = dc.`id`
     WHERE NOT EXISTS (
         SELECT 1 FROM `top_categories_category_relations` tccr
         WHERE tccr.`top_categories_config_id` = (SELECT `id` FROM `top_categories_configs` WHERE `type` = ''PRIMARY'' AND `created_by` = dc.`created_by` LIMIT 1)
         AND tccr.`category_id` = dcr.`category_id`
     )',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Migrar relações de top_gazeta_category_relations para top_categories_category_relations
SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'top_gazeta_category_relations');
SET @sql = IF(@table_exists > 0,
    'INSERT INTO `top_categories_category_relations` (`top_categories_config_id`, `category_id`)
     SELECT 
         (SELECT `id` FROM `top_categories_configs` WHERE `type` = ''SECONDARY'' AND `created_by` = tgc.`created_by` LIMIT 1),
         tgcr.`category_id`
     FROM `top_gazeta_category_relations` tgcr
     INNER JOIN `top_gazeta_configs` tgc ON tgcr.`top_gazeta_config_id` = tgc.`id`
     WHERE NOT EXISTS (
         SELECT 1 FROM `top_categories_category_relations` tccr
         WHERE tccr.`top_categories_config_id` = (SELECT `id` FROM `top_categories_configs` WHERE `type` = ''SECONDARY'' AND `created_by` = tgc.`created_by` LIMIT 1)
         AND tccr.`category_id` = tgcr.`category_id`
     )',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey: Nova foreign key para top_categories_configs (só se users existir e fk não existir)
SET @users_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users');
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.table_constraints 
                  WHERE table_schema = DATABASE() 
                  AND table_name = 'top_categories_configs' 
                  AND constraint_name = 'top_cat_configs_user_fkey');
SET @sql = IF(@users_exists > 0 AND @fk_exists = 0,
    'ALTER TABLE `top_categories_configs` ADD CONSTRAINT `top_cat_configs_user_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey: Nova foreign key para top_categories_category_relations (config)
SET @categories_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'categories');
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.table_constraints 
                  WHERE table_schema = DATABASE() 
                  AND table_name = 'top_categories_category_relations' 
                  AND constraint_name = 'top_cat_rel_config_fkey');
SET @sql = IF(@categories_exists > 0 AND @fk_exists = 0,
    'ALTER TABLE `top_categories_category_relations` ADD CONSTRAINT `top_cat_rel_config_fkey` FOREIGN KEY (`top_categories_config_id`) REFERENCES `top_categories_configs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey: Nova foreign key para top_categories_category_relations (category)
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.table_constraints 
                  WHERE table_schema = DATABASE() 
                  AND table_name = 'top_categories_category_relations' 
                  AND constraint_name = 'top_cat_rel_category_fkey');
SET @sql = IF(@categories_exists > 0 AND @fk_exists = 0,
    'ALTER TABLE `top_categories_category_relations` ADD CONSTRAINT `top_cat_rel_category_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- DropForeignKey: Remover foreign keys antigas (só se as tabelas e foreign keys existirem)
SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'destaque_category_relations');
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_schema = DATABASE() AND table_name = 'destaque_category_relations' AND constraint_name = 'destaque_category_relations_destaque_config_id_fkey');
SET @sql = IF(@table_exists > 0 AND @fk_exists > 0, 'ALTER TABLE `destaque_category_relations` DROP FOREIGN KEY `destaque_category_relations_destaque_config_id_fkey`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists = (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_schema = DATABASE() AND table_name = 'destaque_category_relations' AND constraint_name = 'destaque_category_relations_category_id_fkey');
SET @sql = IF(@table_exists > 0 AND @fk_exists > 0, 'ALTER TABLE `destaque_category_relations` DROP FOREIGN KEY `destaque_category_relations_category_id_fkey`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'destaque_configs');
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_schema = DATABASE() AND table_name = 'destaque_configs' AND constraint_name = 'destaque_configs_created_by_fkey');
SET @sql = IF(@table_exists > 0 AND @fk_exists > 0, 'ALTER TABLE `destaque_configs` DROP FOREIGN KEY `destaque_configs_created_by_fkey`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'top_gazeta_category_relations');
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_schema = DATABASE() AND table_name = 'top_gazeta_category_relations' AND constraint_name = 'top_gazeta_category_relations_top_gazeta_config_id_fkey');
SET @sql = IF(@table_exists > 0 AND @fk_exists > 0, 'ALTER TABLE `top_gazeta_category_relations` DROP FOREIGN KEY `top_gazeta_category_relations_top_gazeta_config_id_fkey`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists = (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_schema = DATABASE() AND table_name = 'top_gazeta_category_relations' AND constraint_name = 'top_gazeta_category_relations_category_id_fkey');
SET @sql = IF(@table_exists > 0 AND @fk_exists > 0, 'ALTER TABLE `top_gazeta_category_relations` DROP FOREIGN KEY `top_gazeta_category_relations_category_id_fkey`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'top_gazeta_configs');
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_schema = DATABASE() AND table_name = 'top_gazeta_configs' AND constraint_name = 'top_gazeta_configs_created_by_fkey');
SET @sql = IF(@table_exists > 0 AND @fk_exists > 0, 'ALTER TABLE `top_gazeta_configs` DROP FOREIGN KEY `top_gazeta_configs_created_by_fkey`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- DropTable: Remover tabelas antigas
DROP TABLE IF EXISTS `destaque_category_relations`;
DROP TABLE IF EXISTS `destaque_configs`;
DROP TABLE IF EXISTS `top_gazeta_category_relations`;
DROP TABLE IF EXISTS `top_gazeta_configs`;

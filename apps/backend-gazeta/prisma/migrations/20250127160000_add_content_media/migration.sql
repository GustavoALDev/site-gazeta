-- CreateTable: ContentMedia
CREATE TABLE `content_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(500) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `content_media_url_unique`(`url`),
    INDEX `content_media_url_idx`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: NewsContentMedia
CREATE TABLE `news_content_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `news_id` INTEGER NOT NULL,
    `content_media_id` INTEGER NOT NULL,

    UNIQUE INDEX `news_content_media_unique`(`news_id`, `content_media_id`),
    INDEX `news_content_media_news_id_idx`(`news_id`),
    INDEX `news_content_media_content_media_id_idx`(`content_media_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey: NewsContentMedia -> News
SET @news_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'news');
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.table_constraints
                  WHERE table_schema = DATABASE()
                  AND table_name = 'news_content_media'
                  AND constraint_name = 'news_content_media_news_id_fkey');
SET @sql = IF(@news_exists > 0 AND @fk_exists = 0,
    'ALTER TABLE `news_content_media` ADD CONSTRAINT `news_content_media_news_id_fkey` FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AddForeignKey: NewsContentMedia -> ContentMedia
SET @content_media_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'content_media');
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.table_constraints
                  WHERE table_schema = DATABASE()
                  AND table_name = 'news_content_media'
                  AND constraint_name = 'news_content_media_content_media_id_fkey');
SET @sql = IF(@content_media_exists > 0 AND @fk_exists = 0,
    'ALTER TABLE `news_content_media` ADD CONSTRAINT `news_content_media_content_media_id_fkey` FOREIGN KEY (`content_media_id`) REFERENCES `content_media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


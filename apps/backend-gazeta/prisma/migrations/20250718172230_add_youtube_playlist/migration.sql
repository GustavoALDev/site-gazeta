-- AlterTable
ALTER TABLE `news` MODIFY `status` VARCHAR(50) NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE `youtube_playlists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `youtube_url` VARCHAR(500) NOT NULL,
    `thumbnail` VARCHAR(500) NOT NULL,
    `duration` VARCHAR(20) NULL,
    `video_id` VARCHAR(50) NOT NULL,
    `display_order` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_emphasis` BOOLEAN NOT NULL DEFAULT false,
    `published_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NOT NULL,

    INDEX `youtube_playlist_order_active_idx`(`display_order`, `is_active`),
    INDEX `youtube_playlist_created_by_fkey`(`created_by`),
    UNIQUE INDEX `youtube_playlist_order_unique`(`display_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `youtube_playlists` ADD CONSTRAINT `youtube_playlists_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

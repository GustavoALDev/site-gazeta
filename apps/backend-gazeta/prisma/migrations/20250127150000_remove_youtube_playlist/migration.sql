-- DropForeignKey: Remover foreign key do YoutubePlaylist
SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'youtube_playlists');
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_schema = DATABASE() AND table_name = 'youtube_playlists' AND constraint_name = 'youtube_playlist_created_by_fkey');
SET @sql = IF(@table_exists > 0 AND @fk_exists > 0, 'ALTER TABLE `youtube_playlists` DROP FOREIGN KEY `youtube_playlist_created_by_fkey`', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- DropTable: Remover tabela youtube_playlists
DROP TABLE IF EXISTS `youtube_playlists`;


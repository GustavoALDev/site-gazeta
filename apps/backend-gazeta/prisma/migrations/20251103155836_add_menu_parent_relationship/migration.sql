-- AlterTable
ALTER TABLE `menus` ADD COLUMN `parent_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `menu_parent_id_idx` ON `menus`(`parent_id`);

-- AddForeignKey
ALTER TABLE `menus` ADD CONSTRAINT `menus_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `menus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

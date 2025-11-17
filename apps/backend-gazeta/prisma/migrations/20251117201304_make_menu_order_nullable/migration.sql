-- DropIndex
DROP INDEX `menu_order_unique` ON `menus`;

-- AlterTable
ALTER TABLE `menus` MODIFY `order` INTEGER NULL;

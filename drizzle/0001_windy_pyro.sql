CREATE TABLE `blockMaterials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`blockId` int NOT NULL,
	`materialId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	CONSTRAINT `blockMaterials_id` PRIMARY KEY(`id`),
	CONSTRAINT `block_material_unique` UNIQUE(`blockId`,`materialId`)
);
--> statement-breakpoint
CREATE TABLE `blocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(140) NOT NULL,
	`imageUrl` text,
	`colorHex` varchar(9) NOT NULL,
	`colorName` varchar(80) NOT NULL,
	`category` varchar(60) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blocks_id` PRIMARY KEY(`id`),
	CONSTRAINT `blocks_name_uq` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`imageUrl` text,
	`description` text,
	`miningLocationId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `materials_name_uq` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `miningLocations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`imageUrl` text,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `miningLocations_id` PRIMARY KEY(`id`),
	CONSTRAINT `miningLocations_name_uq` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `projectSelections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`partId` varchar(100) NOT NULL,
	`partName` varchar(140) NOT NULL,
	`candidateBlockIds` json NOT NULL,
	`selectedBlockId` int,
	`layer` varchar(100) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `projectSelections_id` PRIMARY KEY(`id`),
	CONSTRAINT `projectSelections_part_unique` UNIQUE(`projectId`,`partId`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`status` enum('draft','analyzed','designed') NOT NULL DEFAULT 'draft',
	`sourceImageKey` text,
	`sourceImageUrl` text,
	`buildingHeight` int NOT NULL DEFAULT 100,
	`analysis` json,
	`blueprint2d` json,
	`blueprint3d` json,
	`blueprint2dImageKey` text,
	`blueprint2dImageUrl` text,
	`blueprint3dImageKey` text,
	`blueprint3dImageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `blockMaterials` ADD CONSTRAINT `blockMaterials_blockId_blocks_id_fk` FOREIGN KEY (`blockId`) REFERENCES `blocks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blockMaterials` ADD CONSTRAINT `blockMaterials_materialId_materials_id_fk` FOREIGN KEY (`materialId`) REFERENCES `materials`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materials` ADD CONSTRAINT `materials_miningLocationId_miningLocations_id_fk` FOREIGN KEY (`miningLocationId`) REFERENCES `miningLocations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectSelections` ADD CONSTRAINT `projectSelections_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectSelections` ADD CONSTRAINT `projectSelections_selectedBlockId_blocks_id_fk` FOREIGN KEY (`selectedBlockId`) REFERENCES `blocks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `blockMaterials_block_idx` ON `blockMaterials` (`blockId`);--> statement-breakpoint
CREATE INDEX `blockMaterials_material_idx` ON `blockMaterials` (`materialId`);--> statement-breakpoint
CREATE INDEX `blocks_category_idx` ON `blocks` (`category`);--> statement-breakpoint
CREATE INDEX `blocks_color_idx` ON `blocks` (`colorHex`);--> statement-breakpoint
CREATE INDEX `materials_location_idx` ON `materials` (`miningLocationId`);--> statement-breakpoint
CREATE INDEX `projectSelections_project_idx` ON `projectSelections` (`projectId`);--> statement-breakpoint
CREATE INDEX `projects_user_updated_idx` ON `projects` (`userId`,`updatedAt`);
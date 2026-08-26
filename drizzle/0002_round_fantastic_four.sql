CREATE TABLE `projectReferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`view` enum('front','back','left','right','top','other') NOT NULL DEFAULT 'other',
	`imageKey` text NOT NULL,
	`imageUrl` text NOT NULL,
	`originalName` varchar(200) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectReferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `projectReferences` ADD CONSTRAINT `projectReferences_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `projectReferences_project_idx` ON `projectReferences` (`projectId`,`sortOrder`);
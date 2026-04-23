CREATE TABLE `life_journey_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`category` enum('Milestone','Reflection','Sharing','Music','Statement') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`significance` text,
	`hashtags` text,
	`links` text,
	`sourceUrl` varchar(512),
	`sourcePlatform` varchar(64),
	`createdBy` int,
	`driveFileId` varchar(255),
	`githubCommitHash` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `life_journey_entries_id` PRIMARY KEY(`id`)
);

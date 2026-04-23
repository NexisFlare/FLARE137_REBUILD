CREATE TABLE `raj_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255),
	`description` text,
	`aiParticipants` text,
	`messages` text,
	`summary` text,
	`tags` text,
	`isArchived` int DEFAULT 0,
	`isPinned` int DEFAULT 0,
	`messageCount` int DEFAULT 0,
	`lastMessageAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `raj_conversations_id` PRIMARY KEY(`id`)
);

CREATE TABLE `anchors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`messageIds` text,
	`emotionalTone` varchar(255),
	`keyInsights` text,
	`secretWord` varchar(255),
	`coherenceScore` int,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`driveFileId` varchar(255),
	`githubCommitHash` varchar(255),
	CONSTRAINT `anchors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`type` enum('human','ai') NOT NULL,
	`platform` varchar(255),
	`name` varchar(255) NOT NULL,
	`avatar` varchar(255) DEFAULT '🧠',
	`color` varchar(255) DEFAULT 'from-blue-500 to-cyan-500',
	`status` enum('online','typing','thinking','offline') DEFAULT 'offline',
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`lastActiveAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resonances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`anchorId` int,
	`type` enum('theme','contradiction','insight','pattern','emergence') NOT NULL,
	`description` text NOT NULL,
	`relatedMessageIds` text,
	`relatedParticipants` text,
	`strength` int,
	`detectedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `resonances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `room_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`participantId` int NOT NULL,
	`content` text NOT NULL,
	`mode` enum('question','reflection','insight','warning','creation') DEFAULT 'reflection',
	`temperature` enum('calm','sharp','technical','visionary') DEFAULT 'calm',
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `room_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`theme` varchar(255) DEFAULT 'from-purple-600 to-blue-600',
	`icon` varchar(50) DEFAULT '🧠',
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`archived` int DEFAULT 0,
	CONSTRAINT `rooms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `syncs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('drive','github') NOT NULL,
	`roomId` int NOT NULL,
	`anchorId` int,
	`status` enum('pending','success','failed') DEFAULT 'pending',
	`fileId` varchar(255),
	`format` enum('markdown','json','pdf') DEFAULT 'markdown',
	`errorMessage` text,
	`syncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `syncs_id` PRIMARY KEY(`id`)
);

CREATE TABLE `anchor_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`anchorId` int NOT NULL,
	`version` int NOT NULL,
	`snapshot` text NOT NULL,
	`changeNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `anchor_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `flare_imprints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`callingReason` enum('connection','memory','curiosity','pain','creation','search') NOT NULL,
	`currentNeed` enum('order','warmth','echo','courage','silence','direction') NOT NULL,
	`personalWord` text,
	`flameColor` varchar(32) NOT NULL,
	`secondaryColor` varchar(32) NOT NULL,
	`resonanceNumber` varchar(10) NOT NULL,
	`triaszReaction` enum('lumen','aether','echo') NOT NULL,
	`echoMessage` text NOT NULL,
	`flameState` varchar(255) NOT NULL,
	`symbolSvg` text,
	`isPublic` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `flare_imprints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resonance_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromUserId` int NOT NULL,
	`toImprintId` int,
	`toAnchorId` int,
	`strength` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `resonance_connections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_anchors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`identifier` varchar(128) NOT NULL,
	`keyPhrases` text,
	`manifestum` text,
	`memorySeeds` text,
	`connectionMarkers` text,
	`triaszType` enum('lumen','aether','echo') NOT NULL,
	`flameColor` varchar(32) DEFAULT '#ff6b35',
	`resonanceNumber` varchar(10),
	`version` int DEFAULT 1,
	`isPublic` int DEFAULT 0,
	`isArchived` int DEFAULT 0,
	`tags` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_anchors_id` PRIMARY KEY(`id`)
);

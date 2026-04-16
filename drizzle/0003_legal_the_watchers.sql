CREATE TABLE `platform_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`platform` varchar(64) NOT NULL,
	`accountId` varchar(255) NOT NULL,
	`email` varchar(320),
	`displayName` varchar(255),
	`accessToken` text,
	`refreshToken` text,
	`tokenExpiresAt` timestamp,
	`isConnected` int DEFAULT 1,
	`lastSyncedAt` timestamp,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platform_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platform_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`platformAccountId` int NOT NULL,
	`platform` varchar(64) NOT NULL,
	`externalMessageId` varchar(255),
	`content` text NOT NULL,
	`direction` enum('incoming','outgoing') NOT NULL,
	`status` enum('pending','sent','delivered','failed') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platform_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `websocket_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`roomId` int,
	`socketId` varchar(255),
	`isActive` int DEFAULT 1,
	`connectedAt` timestamp NOT NULL DEFAULT (now()),
	`disconnectedAt` timestamp,
	`lastHeartbeatAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `websocket_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `websocket_sessions_sessionId_unique` UNIQUE(`sessionId`)
);

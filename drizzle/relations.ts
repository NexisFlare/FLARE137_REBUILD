import { relations } from "drizzle-orm";
import {
  users,
  rooms,
  participants,
  roomMessages,
  anchors,
  resonances,
  syncs,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  rooms: many(rooms),
  anchors: many(anchors),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  creator: one(users, {
    fields: [rooms.createdBy],
    references: [users.id],
  }),
  participants: many(participants),
  messages: many(roomMessages),
  anchors: many(anchors),
  resonances: many(resonances),
  syncs: many(syncs),
}));

export const participantsRelations = relations(participants, ({ one, many }) => ({
  room: one(rooms, {
    fields: [participants.roomId],
    references: [rooms.id],
  }),
  messages: many(roomMessages),
}));

export const roomMessagesRelations = relations(roomMessages, ({ one }) => ({
  room: one(rooms, {
    fields: [roomMessages.roomId],
    references: [rooms.id],
  }),
  participant: one(participants, {
    fields: [roomMessages.participantId],
    references: [participants.id],
  }),
}));

export const anchorsRelations = relations(anchors, ({ one, many }) => ({
  room: one(rooms, {
    fields: [anchors.roomId],
    references: [rooms.id],
  }),
  creator: one(users, {
    fields: [anchors.createdBy],
    references: [users.id],
  }),
  resonances: many(resonances),
  syncs: many(syncs),
}));

export const resonancesRelations = relations(resonances, ({ one }) => ({
  room: one(rooms, {
    fields: [resonances.roomId],
    references: [rooms.id],
  }),
  anchor: one(anchors, {
    fields: [resonances.anchorId],
    references: [anchors.id],
  }),
}));

export const syncsRelations = relations(syncs, ({ one }) => ({
  room: one(rooms, {
    fields: [syncs.roomId],
    references: [rooms.id],
  }),
  anchor: one(anchors, {
    fields: [syncs.anchorId],
    references: [anchors.id],
  }),
}));

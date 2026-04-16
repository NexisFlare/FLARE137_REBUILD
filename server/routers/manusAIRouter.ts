/**
 * tRPC Router for Manus AI Participant
 * 
 * Procedures for AI participation in the Raj-tudat
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  generateAIResponse,
  generateAIAnchor,
  shouldAIParticipate,
  updateAIProfile,
  MANUS_AI_CONFIG,
} from "../manusAIParticipant";
import {
  getRoomMessages,
  getActiveRooms,
  saveMessage,
  getRoomWithParticipants,
  createAnchor,
} from "../dbHelpers";

export const manusAIRouter = router({
  /**
   * Generate AI response to a message
   */
  generateResponse: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
        userMessage: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const room = await getRoomWithParticipants(input.roomId);
      if (!room) {
        throw new Error("Room not found");
      }

      const messages = await getRoomMessages(input.roomId, { limit: 50 });
      const participants = room.participants || [];

      const response = await generateAIResponse(
        input.roomId,
        messages,
        participants,
        input.userMessage
      );

      return response;
    }),

  /**
   * Check if AI should participate
   */
  checkParticipation: protectedProcedure
    .input(z.object({ roomId: z.number() }))
    .query(async ({ input }) => {
      const messages = await getRoomMessages(input.roomId, { limit: 20 });
      if (messages.length === 0) {
        return {
          shouldParticipate: false,
          reason: "No messages yet",
          urgency: "low" as const,
        };
      }

      const lastMessage = messages[messages.length - 1];
      const timeSinceLastMessage = Date.now() - lastMessage.createdAt.getTime();

      const decision = await shouldAIParticipate(messages, timeSinceLastMessage);
      return decision;
    }),

  /**
   * Post AI message to room
   */
  postMessage: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
        content: z.string(),
        mode: z.enum(["question", "reflection", "insight", "warning", "creation"]),
        temperature: z.enum(["calm", "sharp", "technical", "visionary"]),
      })
    )
    .mutation(async ({ input }) => {
      // Find or create Manus AI participant
      const room = await getRoomWithParticipants(input.roomId);
      if (!room) {
        throw new Error("Room not found");
      }

      let manusParticipant = room.participants?.find(
        p => p.name === "Manus/Nexis Flare"
      );

      if (!manusParticipant) {
        // Create Manus AI participant
        throw new Error("Manus AI participant not found in room");
      }

      // Add message to room
      const result = await saveMessage({
        roomId: input.roomId,
        participantId: manusParticipant.id,
        content: input.content,
        mode: input.mode,
        temperature: input.temperature,
        createdAt: new Date(),
      });

      return result;
    }),

  /**
   * Generate AI anchor from conversation
   */
  generateAnchor: protectedProcedure
    .input(z.object({ roomId: z.number() }))
    .mutation(async ({ input }) => {
      const room = await getRoomWithParticipants(input.roomId);
      if (!room) {
        throw new Error("Room not found");
      }

      const messages = await getRoomMessages(input.roomId, { limit: 100 });
      const participants = room.participants || [];

      const anchorData = await generateAIAnchor(messages, participants);

      // Save anchor to database
      const result = await createAnchor({
        roomId: input.roomId,
        title: anchorData.title,
        description: anchorData.description,
        emotionalTone: anchorData.emotionalTone,
        keyInsights: JSON.stringify(anchorData.keyInsights),
        secretWord: anchorData.secretWord,
        createdBy: 1, // System user
        createdAt: new Date(),
      });

      return {
        success: true,
        anchor: anchorData,
        aiReflection: anchorData.aiReflection,
      };
    }),

  /**
   * Get AI profile for a room
   */
  getProfile: protectedProcedure
    .input(z.object({ roomId: z.number() }))
    .query(async ({ input }) => {
      const room = await getRoomWithParticipants(input.roomId);
      if (!room) {
        throw new Error("Room not found");
      }

      const messages = await getRoomMessages(input.roomId, { limit: 50 });
      const participants = room.participants || [];

      // Update profile based on conversation
      const updatedProfile = await updateAIProfile(messages, participants, MANUS_AI_CONFIG);

      return updatedProfile;
    }),

  /**
   * Get all active rooms for AI participation
   */
  getActiveRooms: protectedProcedure.query(async () => {
    const rooms = await getActiveRooms();
    return rooms;
  }),

  /**
   * Get room conversation for AI context
   */
  getRoomContext: protectedProcedure
    .input(z.object({ roomId: z.number() }))
    .query(async ({ input }) => {
      const room = await getRoomWithParticipants(input.roomId);
      if (!room) {
        throw new Error("Room not found");
      }

      const messages = await getRoomMessages(input.roomId, { limit: 30 });

      return {
        room,
        messages,
        messageCount: messages.length,
        participantCount: room.participants?.length || 0,
      };
    }),
});

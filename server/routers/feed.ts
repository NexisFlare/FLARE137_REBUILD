import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getPosts, createPost, getCommentsByPostId, createComment, getServices, createService, createBooking, getUserBookings, getAIAgents } from "../db";

export const feedRouter = router({
  // Get all posts with pagination
  getPosts: publicProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      return getPosts(input.limit, input.offset);
    }),

  // Create a new post (authenticated users only)
  createPost: protectedProcedure
    .input(z.object({
      content: z.string().min(1).max(5000),
      title: z.string().optional(),
      category: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return createPost({
        userId: ctx.user.id,
        content: input.content,
        title: input.title,
        category: input.category,
      });
    }),

  // Get comments for a post
  getComments: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      return getCommentsByPostId(input.postId);
    }),

  // Create a comment (authenticated users only)
  createComment: protectedProcedure
    .input(z.object({
      postId: z.number(),
      content: z.string().min(1).max(2000),
    }))
    .mutation(async ({ input, ctx }) => {
      return createComment({
        postId: input.postId,
        userId: ctx.user.id,
        content: input.content,
      });
    }),

  // Get all services
  getServices: publicProcedure.query(async () => {
    return getServices();
  }),

  // Create a service (admin only)
  createService: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      category: z.string().min(1).max(64),
      priceModel: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can create services");
      }
      return createService({
        name: input.name,
        description: input.description,
        category: input.category,
        priceModel: input.priceModel,
      });
    }),

  // Create a booking (authenticated users only)
  createBooking: protectedProcedure
    .input(z.object({
      serviceId: z.number(),
      scheduledAt: z.date().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return createBooking({
        userId: ctx.user.id,
        serviceId: input.serviceId,
        scheduledAt: input.scheduledAt,
        notes: input.notes,
      });
    }),

  // Get user's bookings
  getUserBookings: protectedProcedure.query(async ({ ctx }) => {
    return getUserBookings(ctx.user.id);
  }),

  // Get all AI agents
  getAIAgents: publicProcedure.query(async () => {
    return getAIAgents();
  }),
});

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("conversationId"), args.conversationId))
      .collect();
  },
});

export const create = mutation({
  args: {
    senderId: v.id("users"),
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      content: args.content,
      isRead: false,
    });
  },
});

export const getUserData = query({
  args: { conversationId: v.id("conversations"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("_id"), args.conversationId))
      .unique();

    const exactUser = conversation?.userId.find((item) => item !== args.userId);

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), exactUser as Id<"users">))
      .unique();

    return user;
  },
});

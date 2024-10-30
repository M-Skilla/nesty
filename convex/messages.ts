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
    // return Promise.all(
    //   messages.map(async (msg) => ({
    //     ...msg,
    //     media: await ctx.storage.getUrl(msg.media as Id<"_storage">),
    //   })),
    // );
  },
});

export const getLastMessage = query({
  args: { conversationId: v.id("conversations"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();
    const unreadMessages = unread.length;
    return {
      lastMessage: await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("conversationId"), args.conversationId))
        .order("desc")
        .first(),
      unreadMessages: unreadMessages,
    };
  },
});

export const create = mutation({
  args: {
    senderId: v.id("users"),
    conversationId: v.id("conversations"),
    content: v.string(),
    media: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      content: args.content,
      isRead: false,
      media: args.media,
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

export const markMessagesAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { conversationId, userId } = args;

    // Find all unread messages in this conversation that were not sent by the current user
    const unreadMessages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), conversationId),
          q.eq(q.field("isRead"), false),
          q.neq(q.field("senderId"), userId),
        ),
      )
      .collect();

    // Update each message to mark it as read
    for (const message of unreadMessages) {
      await ctx.db.patch(message._id, { isRead: true });
    }

    return unreadMessages.length; // Return the number of messages marked as read
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getImgUrl = query({
  args: { imgId: v.optional(v.id("_storage")) },
  handler: async (ctx, args) => {
    const { imgId } = args;
    if (imgId) {
      return await ctx.storage.getUrl(imgId);
    }
    return;
  },
});

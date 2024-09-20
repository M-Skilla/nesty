import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: { name: v.string(), externalId: v.id("users"), username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .unique();

    const conversationId = await ctx.db.insert("conversations", {
      name: args.name,
      userId: [args.externalId, user?._id as Id<"users">],
      isGroupChat: false,
    });

    const conversation = await ctx.db.get(conversationId);

    return conversation;
  },
});

export const get = query({
  args: { externalId: v.id("users") },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .order("desc")
      .collect();

    const userConversations = conversations.filter((item) =>
      item.userId.includes(args.externalId),
    );

    const recepient = userConversations.map((item) =>
      item.userId.find((itm) => itm !== args.externalId),
    );

    const conversationId = userConversations.map((item) => item._id);

    return {
      user: await Promise.all(
        recepient.map((user) => ctx.db.get(user as Id<"users">)),
      ),
      conversation: conversationId,
    };
  },
});

// export const getConversationUser = query({
//   args: { conversationId: v.id("conversations") },
//   handler: async (ctx, args) => {
//     const conversation = await ctx.db.get(args.conversationId)

//   },
// });

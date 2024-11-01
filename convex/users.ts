import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";

export const get = query({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("externalId"), args.externalId))
      .order("desc")
      .collect();
  },
});

export const search = query({
  args: { username: v.string(), externalId: v.string() },
  handler: async (ctx, args) => {
    if (!args.username || args.username === "") {
      return await ctx.db
        .query("users")
        .filter((q) => q.neq(q.field("externalId"), args.externalId))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("users")
      .withSearchIndex("searchUsername", (q) =>
        q.search("username", args.username),
      )
      .collect();
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      firstName: data.first_name as string,
      lastName: data.last_name as string,
      username: data.username as string,

      imageUrl: data.image_url,
      externalId: data.id,
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
}

export const getUserConversation = query({
  args: { conversationId: v.id("conversations"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const { conversationId, userId } = args;
    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("_id"), conversationId))
      .unique();
    const receiver = conversation?.userId.filter((itm) => itm !== userId).at(0);
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), receiver))
      .unique();
  },
});

export const updateOnlineStatus = mutation({
  args: { userId: v.id("users"), isOnline: v.boolean() },
  handler: async (ctx, args) => {
    const { userId, isOnline } = args;

    await ctx.db.patch(userId, { isOnline });
  },
});

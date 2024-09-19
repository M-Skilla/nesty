import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  users: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    username: v.string(),
    imageUrl: v.string(),
    externalId: v.string(),
  })
    .index("byUsername", ["username"])
    .index("byExternalId", ["externalId"]),
  conversations: defineTable({
    name: v.string(),
    isGroupChat: v.boolean(),
  }).index("by_name", ["name"]),
  conversationParticipants: defineTable({
    userId: v.string(),
    conversationId: v.string(),
  }),
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    isRead: v.boolean(),
  }),
});

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
    .index("byExternalId", ["externalId"])
    .searchIndex("searchUsername", {
      searchField: "username",
      filterFields: ["firstName", "lastName"],
    }),
  conversations: defineTable({
    name: v.string(),
    isGroupChat: v.boolean(),
    userId: v.array(v.id("users")),
  }).index("by_name", ["name"]),
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    isRead: v.boolean(),
  }),
});

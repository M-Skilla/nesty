/* eslint-disable @typescript-eslint/no-explicit-any */
import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import Message from "./Message";
import TextBar from "./TextBar";
import React, { useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DateHeader } from "./DateHeader";

const MessagesBar = ({ chat }: { chat: string }) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messages = useQuery(api.messages.get, {
    conversationId: chat as Id<"conversations">,
  });
  const { user } = useCurrentUser();
  const userData = useQuery(api.messages.getUserData, {
    conversationId: chat as Id<"conversations">,
    userId: user?._id as Id<"users">,
  });
  const markMessagesAsRead = useMutation(api.messages.markMessagesAsRead);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

    if (user?._id && chat) {
      markMessagesAsRead({
        conversationId: chat as Id<"conversations">,
        userId: user._id as Id<"users">,
      })
        .then((numUpdated) => {
          console.log(`Marked ${numUpdated} messages as read`);
        })
        .catch((error) => {
          console.error("Failed to mark messages as read:", error);
        });
    }
  }, [chat, user?._id, markMessagesAsRead, messages]);

  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {};
    messages.forEach((message) => {
      const date = new Date(message._creationTime).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages || []);
  return (
    <div className="relative mt-5 flex h-[92vh] min-w-[950px] flex-col gap-4 rounded-lg border-border bg-primary/10 p-5">
      <div className="flex items-center justify-between gap-3 rounded-lg bg-primary/40 p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={userData?.imageUrl} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {userData?.isOnline && (
              <div className="absolute bottom-[0.10rem] right-[0.10rem] h-[10px] w-[10px] rounded-full border-none bg-green-400 p-[1px]"></div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-md">
              {userData?.firstName} {userData?.lastName}
            </span>
            <span className="text-xs text-white/55">Online</span>
          </div>
        </div>
        <div className="cursor-pointer rounded-sm bg-primary/40 p-2 hover:bg-primary/50">
          <MoreVertical />
        </div>
      </div>
      <Separator />
      <div className="fle-1 mt-3 flex h-full w-full flex-col gap-4 overflow-y-auto">
        {Object.entries(messageGroups).map(([date, messages]) => (
          <React.Fragment key={date}>
            <DateHeader date={new Date(date)} />
            {messages.map((item, index) => (
              <Message
                content={item.content}
                createdAt={item._creationTime}
                key={index}
                isRead={item.isRead}
                isOwned={item.senderId === user?._id}
                media={item.media}
              />
            ))}
          </React.Fragment>
        ))}
        <div ref={messageEndRef}></div>
      </div>
      <TextBar />
      <div className="flex w-full justify-end text-xs text-white/60">
        Place &nbsp; <kbd> Ctrl + Enter</kbd> &nbsp; to Send.
      </div>
    </div>
  );
};

export default MessagesBar;

import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import Message from "./Message";
import TextBar from "./TextBar";
import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <div className="mt-5 flex h-[92vh] w-[950px] flex-col gap-4 rounded-lg border-border bg-primary/10 p-5">
      <div className="flex items-center justify-between gap-3 rounded-lg bg-primary/40 p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={userData?.imageUrl} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-[0.10rem] right-[0.10rem] h-[10px] w-[10px] rounded-full border-none bg-green-400 p-[1px]"></div>
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
        {messages?.map((item, index) => {
          return (
            <Message
              content={item.content}
              createdAt={item._creationTime}
              key={index}
              isRead={item.isRead}
              isOwned={item.senderId === user?._id}
            />
          );
        })}
        <div ref={messageEndRef}></div>
      </div>
      <TextBar />
    </div>
  );
};

export default MessagesBar;

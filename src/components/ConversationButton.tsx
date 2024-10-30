/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";
import { Id } from "../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type ConversationButtonProps = {
  data: any;
  minimalist?: boolean;
  callback?: () => void;
  isActive?: boolean;
  conversationId?: Id<"conversations">;
};

const ConversationButton = ({
  data,
  minimalist,
  callback,
  isActive,
  conversationId,
}: ConversationButtonProps) => {
  const { user } = useCurrentUser();
  const messageInfo = useQuery(api.messages.getLastMessage, {
    conversationId: conversationId as Id<"conversations">,
    userId: user?._id as Id<"users">,
  });
  return (
    <div
      onClick={callback}
      className={`flex cursor-pointer gap-2 rounded-md p-2 hover:bg-primary/40 ${isActive ? "bg-primary/20" : ""}`}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={data.imageUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        {data.isOnline && (
          <div className="absolute bottom-[0.10rem] right-[0.10rem] h-[10px] w-[10px] rounded-full border-none bg-green-400 p-[1px]"></div>
        )}
      </div>
      <div className="flex w-fit flex-1 flex-col truncate">
        <span className="text-sm text-primary">
          {data.firstName} {data.lastName}
        </span>

        <span className="truncate text-xs text-white/50">
          {!minimalist &&
            messageInfo?.lastMessage?.senderId === user?._id &&
            "You: "}
          {minimalist ? `@${data.username}` : messageInfo?.lastMessage?.content}
        </span>
      </div>
      {!minimalist && (
        <div
          className={`flex w-fit ${messageInfo?.unreadMessages === 0 ? "" : "items-center justify-center"}flex-col `}
        >
          {!messageInfo?.lastMessage?._creationTime ? (
            ""
          ) : (
            <span className="whitespace-nowrap text-xs text-primary/75">
              {new Date(
                messageInfo?.lastMessage?._creationTime as number,
              ).toLocaleTimeString("en-US", { timeStyle: "short" }) || ""}
            </span>
          )}
          {messageInfo?.unreadMessages === 0 ? (
            ""
          ) : (
            <Badge
              variant="default"
              className="pointer-events-none rounded-full text-center"
            >
              {messageInfo?.unreadMessages}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationButton;

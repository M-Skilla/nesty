import { useCurrentUser } from "@/hooks/useCurrentUser";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Separator } from "./ui/separator";

const ConversationProfile = ({ chat }: { chat: string }) => {
  const { user } = useCurrentUser();
  const receiver = useQuery(api.users.getUserConversation, {
    conversationId: chat as Id<"conversations">,
    userId: user?._id as Id<"users">,
  });
  return (
    <div className="mt-5 flex h-[92vh] w-full flex-col rounded-lg bg-primary/10 p-5">
      <div className="mb-3 flex w-full flex-col items-center justify-center gap-3">
        <img
          src={receiver?.imageUrl}
          className="h-28 w-28 rounded-full"
          alt=""
        />
        <div className="flex flex-col justify-center">
          <span>
            {receiver?.firstName} {receiver?.lastName}
          </span>
          <span className="text-primary/30">@{receiver?.username}</span>
        </div>
      </div>
      <Separator className="bg-primary" />
    </div>
  );
};

export default ConversationProfile;

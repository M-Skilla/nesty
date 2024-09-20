import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import ConversationButton from "./ConversationButton";
import { Separator } from "./ui/separator";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ConverstationDialog from "./ConverstationDialog";
import { Id } from "convex/_generated/dataModel";
import { useSearchParams } from "react-router-dom";

const ConversationsBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useCurrentUser();
  const conversations = useQuery(api.conversation.get, {
    externalId: user?._id as Id<"users">,
  });

  const [isInputFocused, setIsInputFocused] = useState(false);
  return (
    <div className="mt-5 hidden h-[92vh] flex-col gap-4 rounded-lg border border-border bg-primary/10 p-5 text-white sm:flex sm:w-[250px] md:w-[350px]">
      <div className="flex flex-col">
        <span className="text-xl">Conversations</span>
        <span className="text-sm text-primary">@{user?.username}</span>
      </div>
      <div className="mb-3 flex gap-1 transition-all ease-in-out">
        <div
          className={`flex items-center rounded-[12px] px-2 py-1 ${isInputFocused ? "border border-primary bg-primary/40" : "border-none bg-primary/20"}`}
        >
          <Search className="font-bold text-white" />
          <Input
            className="flex-1 rounded-[12px] border-none placeholder-shown:text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="Search Conversations..."
          />
        </div>
        <ConverstationDialog />
      </div>
      <Separator className="border-primary" />
      <div className="flex h-full flex-col gap-4 overflow-y-auto rounded-md px-1">
        {conversations?.user?.map((item, index) => {
          return (
            <ConversationButton
              callback={() => {
                setSearchParams((params) => {
                  params.set("chat", conversations.conversation[index]);
                  return params;
                });
              }}
              isActive={
                searchParams.get("chat") === conversations.conversation[index]
              }
              data={item}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ConversationsBar;

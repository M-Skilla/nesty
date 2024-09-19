import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Settings2 } from "lucide-react";
import { useState } from "react";
import ConversationButton from "./ConversationButton";
import { Separator } from "./ui/separator";

const ConversationsBar = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { user } = useCurrentUser();
  return (
    <div className="border-border bg-primary/10 mt-5 hidden h-[92vh] flex-col gap-4 rounded-lg border p-5 text-white sm:flex sm:w-[250px] md:w-[350px]">
      <div className="flex flex-col">
        <span className="text-xl">Conversations</span>
        <span className="text-primary text-sm">@{user?.username}</span>
      </div>
      <div className="mb-3 flex gap-1 transition-all ease-in-out">
        <div
          className={`flex items-center rounded-[12px] px-2 py-1 ${isInputFocused ? "border-primary bg-primary/40 border" : "bg-primary/20 border-none"}`}
        >
          <Search className="font-bold text-white" />
          <Input
            className="flex-1 rounded-[12px] border-none placeholder-shown:text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="Search Conversations..."
          />
        </div>
        <Button
          className="bg-primary/20 h-full rounded-[12px] px-3 text-white"
          variant="default"
        >
          <Settings2 />
        </Button>
      </div>
      <Separator className="border-primary" />
      <div className="flex h-full flex-col gap-4 overflow-y-auto rounded-md">
        {Array.from({ length: 10 }, (_, index) => (
          <ConversationButton key={index} />
        ))}
      </div>
    </div>
  );
};

export default ConversationsBar;

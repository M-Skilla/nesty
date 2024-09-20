/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Plus, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { Input } from "./ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ConversationButton from "./ConversationButton";
import { useDebounce } from "@/hooks/useDebounce";
import { Id } from "convex/_generated/dataModel";
import { useSearchParams } from "react-router-dom";

const ConverstationDialog = () => {
  const { user } = useCurrentUser();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [, setDebouncedSearch] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const addConversation = useMutation(api.conversation.create);

  const users = useQuery(api.users.search, {
    username: search,
    externalId: user?.externalId as string,
  });

  // Debounce function
  const debouncedSetSearch = useDebounce((value: string) => {
    setDebouncedSearch(value);
    setSearch(value);
    // Here you would typically trigger your search operation
    console.log("Searching for:", value);
  }, 300); // 300ms delay

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      debouncedSetSearch(value);
    },
    [debouncedSetSearch],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          className="h-full rounded-[12px] bg-primary/20 px-3 text-white"
          variant="default"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[65vh] w-[450px] px-4">
        <DialogHeader>
          <DialogTitle>Start Conversation</DialogTitle>
          <DialogDescription>
            Click on the users below to start a conversation
          </DialogDescription>
          <div className="mt-3 flex w-full flex-col gap-3">
            <div
              className={`flex w-full items-center rounded-[12px] px-2 py-1 ${isInputFocused ? "border border-primary" : "border border-border"}`}
            >
              <Search className="font-bold text-white" />
              <Input
                className="w-full flex-1 rounded-[12px] border-none placeholder-shown:text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="Search Conversations..."
                onChange={handleSearch}
                value={search}
              />
            </div>
            <div className="flex h-full flex-col gap-4 overflow-y-auto rounded-md">
              {users?.map((item, index) => {
                const handleClick = async () => {
                  const conversation = await addConversation({
                    externalId: user?._id as Id<"users">,
                    name: `${item.firstName} ${item.lastName}`,
                    username: item.username,
                  });
                  setSearchParams((params) => {
                    params.set("chat", conversation?._id as string);
                    return params;
                  });
                  setOpen(false);
                };
                return (
                  <ConversationButton
                    minimalist
                    callback={handleClick}
                    data={item}
                    key={index}
                  />
                );
              })}
              {search && (
                <div className="cursor-pointer rounded-none p-1 text-sm text-stone-400 hover:bg-muted">
                  Create a new group conversation "{search}"
                </div>
              )}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ConverstationDialog;

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const ConversationDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-full rounded-[12px] bg-primary/20 px-3 text-white"
          variant="default"
        >
          <Plus />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer">
          Create Conversation
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Create Group
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationDropdown;

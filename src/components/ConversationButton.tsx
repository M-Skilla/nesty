import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";

const ConversationButton = () => {
  return (
    <div className="hover:bg-primary/20 flex cursor-pointer gap-2 rounded-md p-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col truncate">
        <span className="text-primary text-sm">Marko Skilla</span>
        <span className="truncate text-xs">
          Hi, I noticed your new around here, i need something from you
        </span>
      </div>
      <div className="flex w-fit flex-col items-center justify-center">
        <span className="text-primary/75 whitespace-nowrap text-xs">
          04:02 am
        </span>
        <Badge
          variant="default"
          className="pointer-events-none rounded-full text-center"
        >
          5
        </Badge>
      </div>
    </div>
  );
};

export default ConversationButton;

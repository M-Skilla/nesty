/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";

type ConversationButtonProps = {
  data: any;
  minimalist?: boolean;
  callback?: () => void;
  isActive?: boolean;
};

const ConversationButton = ({
  data,
  minimalist,
  callback,
  isActive,
}: ConversationButtonProps) => {
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

        <div className="absolute bottom-[0.10rem] right-[0.10rem] h-[10px] w-[10px] rounded-full border-none bg-green-400 p-[1px]"></div>
      </div>
      <div className="flex w-fit flex-col truncate">
        <span className="text-sm text-primary">
          {data.firstName} {data.lastName}
        </span>

        <span className="truncate text-xs text-white/50">
          {minimalist
            ? `@${data.username}`
            : "Hi, I noticed your new around here, i need something from you"}
        </span>
      </div>
      {!minimalist && (
        <div className="flex w-fit flex-col items-center justify-center">
          <span className="whitespace-nowrap text-xs text-primary/75">
            04:02 am
          </span>
          <Badge
            variant="default"
            className="pointer-events-none rounded-full text-center"
          >
            5
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ConversationButton;

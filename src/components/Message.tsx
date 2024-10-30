/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Separator } from "./ui/separator";

type MessageProps = {
  isOwned?: boolean;
  content: string;
  createdAt: number;
  isRead: boolean;
  media: any;
};

const Message = ({
  isOwned,
  content,
  createdAt,
  isRead,
  media,
}: MessageProps) => {
  const date = new Date(createdAt);
  const imgUrl = useQuery(api.messages.getImgUrl, {
    imgId: media,
  });

  return (
    <div
      className={`${isOwned ? "flex-row-reverse self-end" : "flex-row self-start"} flex max-w-[30rem] items-end gap-3 text-sm`}
    >
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="w-full">
        <span className="flex items-center justify-between gap-3 text-xs text-white/40">
          {date.toLocaleTimeString("en-US", { timeStyle: "short" })}
          {isOwned && isRead && (
            <CheckCheck className="h-4 w-4 text-xs text-primary" />
          )}
        </span>
        <div
          className={`${isOwned ? "rounded-s-md rounded-t-md" : "rounded-e-md rounded-t-md"} whitespace-pre-wrap bg-primary/55 p-3`}
        >
          {" "}
          {imgUrl && (
            <>
              <div className="mb-2 w-full">
                <img src={imgUrl} alt="" className="rounded-sm" />
              </div>
              <Separator className="mb-3 bg-primary" />
            </>
          )}
          {content}
        </div>
      </div>
    </div>
  );
};

export default Message;

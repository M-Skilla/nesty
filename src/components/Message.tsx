import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type MessageProps = {
  isOwned?: boolean;
  content: string;
  createdAt: number;
  isRead: boolean;
};

const Message = ({ isOwned, content }: MessageProps) => {
  return (
    <div
      className={`${isOwned ? "flex-row-reverse self-end" : "flex-row self-start"} flex max-w-[30rem] items-end gap-3 text-sm`}
    >
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="w-full">
        <span className="text-xs text-white/40">11:00 am</span>
        <div
          className={`${isOwned ? "rounded-s-md rounded-t-md" : "rounded-e-md rounded-t-md"} bg-primary/55 p-3`}
        >
          {content}
        </div>
      </div>
    </div>
  );
};

export default Message;

import { links } from "@/lib/links";
import ChatBarButton from "./ChatBarButton";
import { UserButton } from "@clerk/clerk-react";
import { useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useLocation } from "react-router-dom";

const ChatBar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <div
      className={`z-40 flex h-[95vh] flex-col items-start gap-8 pl-3 pt-5 text-sm transition-all ease-linear ${expanded ? "w-[200px] pr-4" : "w-[70px]"}`}
    >
      {links.map((item, index) => (
        <ChatBarButton
          key={index}
          icon={item.icon}
          name={item.name}
          link={item.href}
          expanded={expanded}
          className={
            location.pathname === item.href ? "bg-muted" : "hover:bg-muted"
          }
        />
      ))}
      <div className="flex w-full flex-1 flex-col place-content-end gap-3 pb-5">
        <div className="hover:bg-muted flex w-full cursor-pointer items-center gap-4 rounded-md p-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
          {expanded && <span>Profile</span>}
        </div>
        <Button
          variant="default"
          className="self-center rounded-full"
          size="icon"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? (
            <CaretLeftIcon className="h-7 w-7" />
          ) : (
            <CaretRightIcon className="h-7 w-7" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatBar;

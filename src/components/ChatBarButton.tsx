import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type ChatBarButtonProps = {
  icon: React.JSX.Element;
  name: string;
  expanded?: boolean;
  link?: string;
  className?: string;
};

const ChatBarButton = ({
  icon,
  name,
  expanded,
  link,
  className,
}: ChatBarButtonProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        "flex w-full cursor-pointer items-center gap-4 rounded-md p-2",
        className,
      )}
    >
      <Button
        onClick={() => navigate(link || "#")}
        className="flex"
        variant="ghost"
        size="icon"
      >
        {icon}
      </Button>
      {expanded && <div>{name}</div>}
    </div>
  );
};

export default ChatBarButton;

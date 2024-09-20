import { Send, Smile } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSearchParams } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const TextBar = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [text, setText] = useState("");
  const createMessage = useMutation(api.messages.create);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [searchParams] = useSearchParams();
  const { user } = useCurrentUser();

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [text]);
  return (
    <div className="flex w-full items-center gap-3 rounded-lg">
      <div className="cursor-pointer rounded-md bg-primary/40 p-2 hover:bg-primary/50">
        <Smile className="h-5 w-5" />
      </div>
      <div
        className={`flex flex-1 items-center gap-3 rounded-md border border-orange-500/20 px-2 ${isInputFocused && "border border-orange-600"}`}
      >
        <Textarea
          className="h-4 resize-none border-none focus-visible:ring-0"
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          ref={textAreaRef}
          onChange={(e) => setText(e.target.value)}
        />
        <div
          onClick={() =>
            createMessage({
              content: text,
              conversationId: searchParams.get("chat") as Id<"conversations">,
              senderId: user?._id as Id<"users">,
            })
          }
          className="cursor-pointer rounded-md bg-orange-700 p-2 hover:bg-secondary/50"
        >
          <Send className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default TextBar;

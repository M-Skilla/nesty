import { Plus, Send, Smile, X } from "lucide-react";
import { Textarea } from "./ui/textarea";
import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSearchParams } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Input } from "./ui/input";

const TextBar = () => {
  const [searchParams] = useSearchParams();
  const { user } = useCurrentUser();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [images, setImages] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | undefined>();
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const textInputImageRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const createMessage = useMutation(api.messages.create).withOptimisticUpdate(
    async (localStore, args) => {
      const { content, media } = args;
      const messages = localStore.getQuery(api.messages.get, {
        conversationId: searchParams.get("chat") as Id<"conversations">,
      });

      if (messages !== undefined) {
        const now = Date.now();
        const newMessage = {
          _id: crypto.randomUUID() as Id<"messages">,
          _creationTime: now,
          conversationId: searchParams.get("chat") as Id<"conversations">,
          senderId: user?._id as Id<"users">,
          content,
          isRead: false,
          media: media || undefined,
        };
        localStore.setQuery(
          api.messages.get,
          { conversationId: searchParams.get("chat") as Id<"conversations"> },
          [...messages, newMessage],
        );
      }

      setImages(undefined);
      imageInputRef.current!.value = "";
    },
  );
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        divRef.current?.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [text]);

  useEffect(() => {
    if (images) {
      const url = URL.createObjectURL(images);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [images]);
  return (
    <div className="flex w-full items-center gap-3 rounded-lg">
      <div
        onClick={() => setEmojiOpen((prev) => !prev)}
        className="cursor-pointer rounded-md bg-primary/40 p-2 hover:bg-primary/50"
      >
        <Smile />
      </div>
      <div
        onClick={() => {
          if (imageInputRef.current) {
            imageInputRef.current.click();
          }
        }}
        className="cursor-pointer rounded-md bg-primary/40 p-2 hover:bg-primary/50"
      >
        <Plus className="pointer-events-none" />
        <Input
          ref={imageInputRef}
          className="hidden"
          id="picture"
          type="file"
          accept="image/*"
          onChange={(e) => setImages(e.target.files?.[0])}
        />
      </div>
      {images && (
        <div
          className={`absolute bottom-[7rem] min-w-48 max-w-96 rounded-sm bg-background p-3 shadow-lg shadow-black/40`}
        >
          {preview ? (
            <>
              <div className="relative mb-4 flex w-full items-center justify-center rounded-sm border border-primary/20 p-6">
                <img src={preview} className="rounded-sm" />
                <X
                  onClick={() => setImages(undefined)}
                  className="absolute right-2 top-2 h-4 w-4 cursor-pointer"
                />
              </div>
              <div
                className={`flex flex-1 items-center gap-3 rounded-md border border-orange-500/20 px-2 ${isInputFocused && "border border-orange-600"}`}
              >
                <div className="text-xs text-white">Caption</div>
                <Input
                  className="resize-none rounded-none border-b-0 border-l border-r-0 border-t-0 border-l-orange-700 focus-visible:ring-0"
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                  ref={textInputImageRef}
                />
                <div
                  onClick={async () => {
                    let imageUrl;
                    let storageImg;

                    if (images) {
                      imageUrl = await generateUploadUrl();
                      const res = await fetch(imageUrl, {
                        method: "POST",
                        headers: { "Content-Type": images.type },
                        body: images,
                      });
                      const { storageId } = await res.json();
                      storageImg = storageId;
                    }
                    createMessage({
                      content: text,
                      conversationId: searchParams.get(
                        "chat",
                      ) as Id<"conversations">,
                      senderId: user?._id as Id<"users">,
                      media: storageImg,
                    });
                    setImages(undefined);
                    setText("");
                  }}
                  className="cursor-pointer rounded-md bg-orange-700 p-2 hover:bg-secondary/50"
                  ref={divRef}
                >
                  <Send className="h-4 w-4" />
                </div>
              </div>
            </>
          ) : (
            <div>No Object</div>
          )}
        </div>
      )}
      <EmojiPicker
        onEmojiClick={(emoji) => setText(text + emoji.emoji)}
        open={emojiOpen}
        lazyLoadEmojis
        theme={Theme.DARK}
        className="absolute"
        emojiStyle={EmojiStyle.FACEBOOK}
      />
      <div
        className={`flex flex-1 items-center gap-3 rounded-md border border-orange-500/20 px-2 ${isInputFocused && "border border-orange-600"}`}
      >
        <Textarea
          className="h-4 resize-none border-none focus-visible:ring-0"
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          ref={textAreaRef}
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div
          onClick={() => {
            createMessage({
              content: text,
              conversationId: searchParams.get("chat") as Id<"conversations">,
              senderId: user?._id as Id<"users">,
            });
            setText("");
          }}
          className="cursor-pointer rounded-md bg-orange-700 p-2 hover:bg-secondary/50"
          ref={divRef}
        >
          <Send className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default TextBar;

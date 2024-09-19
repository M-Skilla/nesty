import { MessageCircle, PhoneCall } from "lucide-react";

const className = "w-7 h-7 text-primary";

export const links = [
  {
    icon: <MessageCircle className={className} />,
    name: "Chats",
    href: "/",
  },
  {
    icon: <PhoneCall className={className} />,
    name: "Phone",
    href: "/phone",
  },
];

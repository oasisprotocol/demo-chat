import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FC } from "react";

interface Props {
  message: Message;
  address: string;
}

const ChatMessage: FC<Props> = ({ message, address }) => {
  return (
    <div
      key={Math.random()}
      className={cn("flex", message.sender === address ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          message.sender === address
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <p>{message.content}</p>
        <span className="text-xs opacity-70">
          {format(new Date(Number(message.timestamp) * 1000), "h:mm a")}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;

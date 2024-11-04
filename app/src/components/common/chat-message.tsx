import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FC } from "react";
import Jazzicon from "react-jazzicon";

interface Props {
  message: Message;
  address: string;
  showDate?: boolean;
}

const ChatMessage: FC<Props> = ({ message, address, showDate }) => {
  const isOwn = message.sender === address;
  const messageDate = new Date(Number(message.timestamp) * 1000);

  return (
    <div className="flex flex-col gap-2">
      {showDate && (
        <div className="flex items-center justify-center my-4">
          <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {format(messageDate, "MMMM d, yyyy")}
          </div>
        </div>
      )}
      <div
        className={cn("flex items-start gap-2",
          isOwn ? "justify-end" : "justify-start"
        )}
      >
        {!isOwn && (
          <Jazzicon 
            diameter={24} 
            seed={parseInt(message.sender.slice(2, 10), 16)} 
          />
        )}
        <div
          className={cn(
            "max-w-[80%] rounded-lg p-3 shadow-sm",
            isOwn
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          )}
        >
          <p className="text-sm">{message.content}</p>
          <span className="text-xs opacity-70">
            {format(messageDate, "h:mm a")}
          </span>
        </div>
        {isOwn && (
          <Jazzicon 
            diameter={24} 
            seed={parseInt(message.sender.slice(2, 10), 16)} 
          />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

import { FC } from "react";

interface Props {
  avatar: string;
  name: string;
  timestamp: Date;
  content: string;
}

const ChatMessage: FC<Props> = ({ avatar, name, timestamp, content }) => {
  return (
    <div className="flex gap-4 p-4">
      <div className="flex-shrink-0">
        <img
          src={avatar}
          alt={`${name}'s avatar`}
          className="w-10 h-10 rounded-full"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold">{name}</span>
          <span className="text-sm text-gray-500">
            {timestamp.toLocaleString()}
          </span>
        </div>

        <p className="text-gray-700">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;

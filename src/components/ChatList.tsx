import type { Chat } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export default function ChatList({ chats, selectedChatId }: { chats: Chat[] | undefined, selectedChatId: string }) {
  return (
    <>
      <h1 className="text-xl font-bold">Chats</h1>
      <ul>
        {chats && chats.map(chat => (
          <li key={chat.id}>
            <Link to="/chats/$chatId" params={{ chatId: chat.id }}
              className={cn(selectedChatId === chat.id && 'text-blue-600')}>
              {chat.name ?? "Untitled"}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

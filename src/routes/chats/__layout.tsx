import ChatList from '@/components/ChatList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SocketProvider, useSocket } from '@/integrations/socket';
import { useAPI } from '@/lib/api';
import type { Chat, Message } from '@/lib/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Outlet, useParams } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createFileRoute('/chats')({
  component: ChatsLayout,
})

function ChatsLayout() {
  return (
    <SocketProvider>
      <InnerChatsLayout />
    </SocketProvider>
  );
}

function InnerChatsLayout() {
  const queryClient = useQueryClient();
  const { request } = useAPI();
  const { chatId } = useParams({ strict: false });
  const { data: chats, isLoading } = useQuery<Chat[]>({
    queryKey: ['chats'],
    queryFn: () => request('/chats'),
  });
  const socket = useSocket();
  useEffect(() => {
    if (!socket)
      return () => {};
    const onNewChat = (chat: Chat) => {
      if (!isLoading)
        queryClient.setQueryData<Chat[]>(['chats'], (old = []) => [...old, chat]);
    }
    socket.on('chat:new', onNewChat);
    return () => {
      socket.off('chat:new', onNewChat);
    }
  }, [socket]);

  return (
    <div className="flex h-screen overflow-y-hidden">
      <ScrollArea className="w-64 border-r p-4 overflow-y-auto shrink-0">
        <ChatList chats={chats} selectedChatId={chatId} />
      </ScrollArea>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

import ChatMessages from '@/components/ChatMessages';
import { useAPI } from '@/lib/api';
import type { Message } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import ChatInput from '@/components/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSocket } from '@/integrations/socket';
import { useEffect } from 'react';

export const Route = createFileRoute('/chats/$chatId')({
  component: ChatPage,
})

function ChatPage() {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const { chatId } = Route.useParams();
  const { request } = useAPI();

  const { data, isLoading } = useQuery<{ id: string, messages: Message[] }>({
    queryKey: ['chats', chatId],
    queryFn: () => request(`/chats/${chatId}`),
  });
  const mutation = useMutation({
    mutationFn: (values: object) => request('/chats', {
      method: 'POST',
      body: { ...values, chatId }
    }),
    onSuccess: () => {
      if (!socket?.connected) {
        console.log("Invalidate queries.");
        queryClient.invalidateQueries({ queryKey: ['chats', chatId] });
      }
    }
  });

  useEffect(() => {
    if (!socket)
      return () => {};
    socket.emit('chat:join', chatId);
    const onNewMessage = (message: Message) => {
      queryClient.setQueryData<{ id: string, messages: Message[] }>(['chats', chatId], (old) => {
        if (!old) return { id: chatId!, messages: [message] }; // empty cache fallback
        return { ...old, messages: [...old.messages, message] };
      });
    }
    socket.on('message:new', onNewMessage);
    return () => {
      socket.emit('chat:leave', chatId);
      socket.off('message:new', onNewMessage);
    }
  }, [socket, chatId]);

  const sendMessage = async ({ text, files }) => {
    return mutation.mutateAsync({ text });
  }

  return (
    <div className="p-4 flex flex-col flex-grow overflow-y-hidden">
      <ScrollArea className="flex-1 overflow-y-auto">
        {data &&
          <ChatMessages messages={data?.messages} />
        }
      </ScrollArea>
      <ChatInput onSend={sendMessage} />
    </div>
  )
}

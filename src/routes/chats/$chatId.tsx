import ChatMessages from '@/components/ChatMessages';
import { useAPI } from '@/lib/api';
import type { Flashcard, Message } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import ChatInput from '@/components/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSocket } from '@/integrations/socket';
import { useEffect } from 'react';
import Flashcard from '@/components/Flashcard';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import Flashcards from '@/components/Flashcards';
import FlashcardsHeader from '@/components/FlashcardsHeader';

export const Route = createFileRoute('/chats/$chatId')({
  component: ChatPage,
})

type ChatDto = {
  id: string;
  messages: Message[];
  flashcards: Flashcard[];
}

function ChatPage() {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const { chatId } = Route.useParams();
  const { request } = useAPI();

  const { data, isLoading } = useQuery<ChatDto>({
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
      queryClient.setQueryData<ChatDto>(['chats', chatId], (old) => {
        if (!old) return { id: chatId!, messages: [message], flashcards: [] };
        return { ...old, messages: [...old.messages, message] };
      });
    }
    const onNewCard = (card: Flashcard) => {
      queryClient.setQueryData<ChatDto>(['chats', chatId], (old) => {
        if (!old) return { id: chatId!, messages: [], flashcards: [card] };
        return { ...old, flashcards: [...old.flashcards, card] };
      });
    }
    socket.on('message:new', onNewMessage);
    socket.on('card:new', onNewCard);
    return () => {
      socket.emit('chat:leave', chatId);
      socket.off('message:new', onNewMessage);
      socket.off('card:new', onNewCard);
    }
  }, [socket, chatId]);

  const sendMessage = async ({ text, files }) => {
    return mutation.mutateAsync({ text });
  }

  return (
    <div className="flex p-2 h-full">
      <div className="p-2 flex flex-col w-1/2 overflow-y-hidden">
        <ScrollArea className="flex-1 overflow-y-auto">
          {data &&
            <ChatMessages messages={data?.messages} />
          }
        </ScrollArea>
        <ChatInput onSend={sendMessage} />
      </div>
      <div className="p-2 flex flex-col w-1/2 overflow-y-hidden">
        <FlashcardsHeader flashcards={data?.flashcards} />
        <ScrollArea className="flex-1 overflow-y-auto">
          <Flashcards flashcards={data?.flashcards} />
        </ScrollArea>
      </div>
    </div>
  )
}

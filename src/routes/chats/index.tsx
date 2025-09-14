import ChatInput from '@/components/ChatInput';
import { useAuth } from '@/integrations/auth';
import { useAPI } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/chats/')({
  component: EmptyChat,
});

function EmptyChat() {
  let navigate = Route.useNavigate();
  const { user } = useAuth();
  const { request } = useAPI();
  const mutation = useMutation({
    mutationFn: (body: object) => request('/chats', {
      method: 'PUT',
      body
    }),
    onSuccess: (data) => {
      navigate({ to: '/chats/$chatId', params: { chatId: data.id } });
    }
  });
  const sendMessage = async ({ text, files }) => {
    return mutation.mutateAsync({ text });
  }
  return (
    <div className="flex flex-col justify-center flex-1">
      <h1 className="text-2xl mb-4 text-center">Hello, <b>{user?.username}</b>.</h1>
      <ChatInput onSend={sendMessage} />
    </div>
  );
}

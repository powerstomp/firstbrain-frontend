import LoginCard from '@/components/LoginCard'
import { useAuth } from '@/integrations/auth';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  let navigate = Route.useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated)
      navigate({ to: '/chats' });
  }, [auth.isAuthenticated]);

  return (
    <div className="flex flex-grow justify-center items-center">
      <LoginCard auth={auth} />
    </div >
  )
}

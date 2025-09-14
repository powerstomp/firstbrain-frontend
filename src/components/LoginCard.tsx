import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AuthState } from '@/integrations/auth'
import { useState } from 'react'

export default function LoginCard({ auth }: { auth: AuthState }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleLogin = async (formData: FormData) => {
    const { username, password } = Object.fromEntries(formData.entries());
    setIsLoading(true);
    try {
      await auth.login(username.toString(), password.toString());
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Card className="w-sm">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          You'll need an account to use this website. Contact an administrator for details.
        </CardDescription>
      </CardHeader>
      <form action={handleLogin}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" type="text" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {error && <div className="text-red-600 mb-2">{error.message}</div>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

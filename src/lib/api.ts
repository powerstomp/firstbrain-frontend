import { useAuth } from '@/integrations/auth';

export function useAPI() {
	const { token } = useAuth();

	async function request<T>(url: string, options: Omit<RequestInit, 'body'> & { body?: any } = {}): Promise<T> {
		const { body, ...rest } = options;

		const res = await fetch(`http://localhost:3000${url}`, {
			...rest,
			headers: {
				...(rest.headers || {}),
				Authorization: token ? `Bearer ${token}` : '',
				'Content-Type': 'application/json',
			},
			body: body ? JSON.stringify(body) : undefined
		});
		if (!res.ok)
			throw new Error(`API error ${res.status}: ${res.statusText}`);
		return res.json();
	}

	return { request };
}

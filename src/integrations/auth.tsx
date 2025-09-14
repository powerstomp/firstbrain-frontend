import type { User } from '@/lib/types';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthState = {
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
	login: (username: string, password: string) => Promise<void>;
	logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const userJson = localStorage.getItem('user');
		const token = localStorage.getItem('token');
		if (!token || !userJson)
			return;
		setUser(JSON.parse(userJson));
		setToken(token);

		setIsAuthenticated(true);
	}, []);

	const login = async (username: string, password: string) => {
		const res = await fetch('http://localhost:3000/users/authenticate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});
		if (!res.ok)
			throw new Error(`Login failed: ${res.statusText}`);
		const { user, token }: { user: User, token: string } = await res.json();
		setUser(user);
		setToken(token);

		localStorage.setItem('user', JSON.stringify(user));
		localStorage.setItem('token', token);
		setIsAuthenticated(true);
	}

	const logout = () => {
		setUser(null);
		setToken(null);

		localStorage.removeItem('user');
		localStorage.removeItem('token');
		setIsAuthenticated(false);
	}

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined)
		throw new Error('useAuth must be used within an AuthProvider');
	return context;
}

export { type AuthState, AuthProvider, useAuth };

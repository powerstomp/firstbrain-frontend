import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth";
import { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext<Socket | null>(null);

function SocketProvider({ children }: { children: React.ReactNode }) {
	const { token } = useAuth();
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		if (!token)
			return () => {};
		const s = io("http://localhost:3000", { auth: { token } });
		setSocket(s);
		return () => {
			s.disconnect();
			setSocket(null);
		};
	}, [token]);

	return (
		<SocketContext.Provider value= { socket } >
		{ children }
		</SocketContext.Provider>
  );
};

function useSocket() {
	const context = useContext(SocketContext);
	if (context === undefined)
		throw new Error('useSocket must be used within an SocketProvider');
	return context;
}

export { SocketProvider, useSocket };

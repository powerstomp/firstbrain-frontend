import type { Message } from "@/lib/types";
import ChatMessage from "./ChatMessage";

export default function ChatMessages({ messages }: { messages: Message[] }) {
	return (
		<>
			{messages.map((msg) =>
				<ChatMessage message={msg} key={msg.id} />
			)}
		</>
	);
}

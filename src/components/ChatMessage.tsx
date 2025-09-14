import type { Message } from "@/lib/types";
import { Card, CardContent } from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import Markdown from "react-markdown"

export default function ChatMessage({ message }: { message: Message }) {
	return (
		<Card>
			<CardContent>
				<b>{message.author.username}</b> ({formatDistanceToNow(message.createdAt, { addSuffix: true })})
				<div className="prose max-w-none min-w-0 wrap-anywhere">
					<Markdown>
						{message.text}
					</Markdown>
				</div>
			</CardContent>
		</Card>
	);
}

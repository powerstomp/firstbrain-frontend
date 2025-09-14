import { useDragAndDrop } from "@/integrations/dragndrop";
import { useRef, useState } from "react";
import { Paperclip, SendHorizontal } from "lucide-react";

type Props = {
	onSend: (msg: { text: string; files: File[] }) => void
};

export default function ChatInput({ onSend }: Props) {
	const [text, setText] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const addFiles = (newFiles: FileList | File[]) => {
		setFiles((prev) => [...prev, ...Array.from(newFiles)]);
	}
	useDragAndDrop(addFiles);

	const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
		if (e.clipboardData.files.length > 0) {
			e.preventDefault();
			addFiles(e.clipboardData.files);
		}
	}

	const handleSend = () => {
		if (!text.trim() && files.length === 0)
			return;
		onSend({ text, files });
		setText("");
		setFiles([]);
	}
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	}

	return (
		<div
			className="border-t p-2 flex flex-col gap-2"
		>
			{files.length > 0 && (
				<div className="flex gap-2 flex-wrap">
					{files.map((f, i) => (
						<span key={i} className="text-sm bg-gray-200 px-2 py-1 rounded">
							{f.name}
						</span>
					))}
				</div>
			)}

			<div className="flex gap-2 items-center">
				<textarea
					value={text}
					onChange={(e) => setText(e.target.value)}
					onPaste={handlePaste}
					placeholder="Type a message..."
					className="resize-none flex-1 border rounded p-2"
					onKeyDown={handleKeyDown}
				/>
				<input
					ref={fileInputRef}
					type="file"
					multiple
					className="hidden"
					onChange={(e) => addFiles(e.target.files)}
				/>
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className="px-3 py-2 bg-gray-100 rounded cursor-pointer"
				>
					<Paperclip />
				</button>
				<button
					type="button"
					onClick={handleSend}
					className="bg-blue-500 text-white px-3 py-2 rounded cursor-pointer"
				>
					<SendHorizontal />
				</button>
			</div>
		</div>
	)
}

import type { Flashcard } from "@/lib/types";
import { Download, Plus } from "lucide-react";
import { Button } from "./ui/button";

export default function FlashcardsHeader({ flashcards }: { flashcards: Flashcard[] }) {
	const handleExportCSV = () => {
		const csv = flashcards.map((x) => `${x.front}\t${x.back}`).join('\n');
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "cards.tsv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		URL.revokeObjectURL(url);
	}
	return (
		<div className="flex gap-2 mb-2">
			<h2 className="font-bold text-xl">Your flashcards</h2>
			<Button onClick={handleExportCSV}><Download /></Button>
		</div>
	);
}

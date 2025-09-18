import type { Flashcard } from "@/lib/types";
import { Card, CardContent } from "./ui/card";

export default function Flashcard({ flashcard }: { flashcard: Flashcard }) {
	return (
		<>
			<Card>
				<CardContent>
					<b>{flashcard.front}</b>
					<hr />
					{flashcard.back ?? <i>[front side only]</i>}
				</CardContent>
			</Card>
		</>
	)
}

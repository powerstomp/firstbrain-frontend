import type { Flashcard } from "@/lib/types";
import FlashcardDisplay from "./Flashcard";

export default function Flashcards({ flashcards }: { flashcards: Flashcard[] }) {
	return (
		<>
			{flashcards && flashcards.map((flashcard) =>
				<FlashcardDisplay flashcard={flashcard} key={flashcard.id} />
			)}
		</>
	);
}

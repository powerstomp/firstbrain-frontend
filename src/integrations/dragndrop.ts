import { useEffect } from "react"

export function useDragAndDrop(onFiles: (files: File[]) => void) {
	useEffect(() => {
		const handleDragOver = (e: DragEvent) => {
			e.preventDefault();
		}

		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
			if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
				const files = Array.from(e.dataTransfer.files);
				onFiles(files);
				e.dataTransfer.clearData();
			}
		}

		document.addEventListener("dragover", handleDragOver);
		document.addEventListener("drop", handleDrop);

		return () => {
			document.removeEventListener("dragover", handleDragOver);
			document.removeEventListener("drop", handleDrop);
		}
	}, [onFiles])
}

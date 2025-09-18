type User = {
	id: number;
	username: string;
};
type Chat = {
	id: string;
	name?: string;
};
type Message = {
	id: string;
	author: User;
	text: string;
	createdAt: Date;
};
type Flashcard = {
	id: string;
	front: string;
	back: string;
	createdAt: Date;
	updatedAt: Date;
};

export type { User, Chat, Message, Flashcard };

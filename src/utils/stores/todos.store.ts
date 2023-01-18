import { writable, type Updater, type Writable } from 'svelte/store';

export type Todo = {
	id: string;
	todo: string;
	isDone: boolean;
};

interface TodoStore {
	subscribe: Writable<Todo[]>['subscribe'];
	reset: () => void;
	update: (this: void, updater: Updater<Todo[]>) => void;
}

function createTodoStore(): TodoStore {
	const { subscribe, set, update } = writable<Todo[]>([]);

	function reset() {
		set([]);
	}

	return {
		subscribe,
		reset,
		update
	};
}

export const todos = createTodoStore();

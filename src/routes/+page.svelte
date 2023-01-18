<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	// @ts-ignore
	import { todos as storeTodos, type Todo } from '../utils/stores/todos.store';
	import { SVELTE_TODOS } from '../utils/constants';

	let todos: Todo[] = [];

	const unsubscribe = storeTodos.subscribe((value: any) => {
		todos = value;
	});

	onMount(() => {
		let prevTodos = localStorage.getItem(SVELTE_TODOS);
		if (prevTodos) {
			storeTodos.update(JSON.parse(prevTodos));
		}
	});

	let newTodo = '';
	function addTodo(e: any) {
		e.preventDefault();
		let todo: Todo = {
			id: Date.now().toString(),
			todo: newTodo,
			isDone: false
		};
		storeTodos.update(() => [...todos, todo]);
		updateLocalStorage();
		newTodo = '';
	}

	function updateLocalStorage() {
		localStorage.setItem(SVELTE_TODOS, JSON.stringify(todos));
	}

	function handleCheckboxChange(e: any) {
		const { id, checked } = e.target;
		if (!id) return;
		storeTodos.update((todos: Todo[]) => {
			return todos.map((todo: Todo) => {
				if (todo.id === id) {
					todo.isDone = checked;
				}
				return todo;
			});
		});
		updateLocalStorage();
	}

    function handleClickDelete(id: string){
        storeTodos.update((todos: Todo[]) => {
            return todos.filter((todo: Todo) => {
                return todo.id !== id;
            });
        });
        updateLocalStorage();
    }

	onDestroy(unsubscribe);
</script>

<nav>
	<h3>TODO List Assignment</h3>
</nav>
<div class="container">
	<form on:submit={addTodo}>
		<input required type="text" placeholder="Add a new todo" bind:value={newTodo} />
		<button type="submit">+ Add</button>
	</form>
	<div class="todoList">
		{#each todos as todo}
			<div class="todo">
				<input
					id={todo.id}
					type="checkbox"
					on:change={handleCheckboxChange}
					bind:checked={todo.isDone}
				/>
				<span>{todo.todo}</span>
                <span on:click={() => handleClickDelete(todo.id)}>x</span>
			</div>
		{/each}
	</div>
</div>

<style>
	*,
	*::after,
	*::before {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: Arial, Helvetica, sans-serif;
	}
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 500px;
		margin: 0 auto;
		margin-top: 100px;
	}
	form {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}
	.todoList {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	.todoList .todo {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		margin: 10px 0;
		padding: 0.7rem 1.2rem;
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 0.2rem;
	}
	.todoList .todo span {
		margin-left: 10px;
	}
    .todoList .todo span:last-child {
        margin-left: auto;
        cursor: pointer;

    }
	h3 {
		text-align: center;
	}
	form input {
		outline: none;
		border: none;
		margin: 10px 0;
		padding: 0.7rem 1.2rem;
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 0.2rem;
		flex: 1;
	}

	button {
		outline: none;
		border: none;
		padding: 0.7rem 1.2rem;
		border-radius: 0.2rem;
		background-color: rgb(0, 184, 0);
		font-weight: 600;
		color: white;
	}
	nav {
		background-color: #333;
		color: #fff;
		height: 50px;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>

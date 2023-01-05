'use strict';

let currentTodos = [
    { id: 1, title: 'HTML', completed: true },
    { id: 2, title: 'CSS', completed: true },
    { id: 3, title: 'Javascript', completed: true },
];

const root = document.querySelector('.todoapp');
const newTodoField = root.querySelector('.new-todo');
const itemsList = root.querySelector('.todo-list');
const allToggler = root.querySelector('.toggle-all');
const clearCompletedButton = root.querySelector('.clear-completed');
const filter = root.querySelector('.filters');



render();

function render() {
    const activeTodos = currentTodos.filter(todo => !todo.completed);
    const completedTodos = currentTodos.filter(todo => todo.completed);

    root.innerHTML = `
        <header class="header">
            <h1>todos</h1>
            <input class="new-todo" placeholder="What needs to be done?" autofocus>
        </header>

        ${currentTodos.length > 0 ? `
            <section class="main">

                <span class="toggle-all-container">
                    <input id="toggle-all" class="toggle-all" type="checkbox"
                    ${activeTodos.length === 0 ? "checked" : ""}
                    >
                    <label for="toggle-all">Mark all as complete</label>
                </span>

                <ul class="todo-list">
                    ${currentTodos
                    .map(
                        (todo) => `
                        <li
                            class="todo-item ${todo.completed ? "completed" : ""}"
                            data-todo-id="${todo.id}"
                        >
                            <input
                                id="todo-${todo.id}"
                                type="checkbox"
                                class="toggle"
                                ${todo.completed ? "checked" : ""}
                            >
                            <label for="todo-${todo.id}">${todo.title}</label>
                            <button class="destroy"></button>
                        </li>
                    `
                    )
                    .join("")}
                </ul>
            </section>

            <footer class="footer">
                <span class="todo-count">
                    ${activeTodos.length} items left
                </span>

                <ul class="filters">
                    <li>
                        <a href="#/" class="selected" data-filter="all">All</a>
                    </li>
                    <li>
                        <a href="#/active" data-filter="active">Active</a>
                    </li>
                    <li>
                        <a href="#/completed" data-filter="completed">Completed</a>
                    </li>
                </ul>

                ${completedTodos.length > 0 ? `
                    <button class="clear-completed">Clear completed</button>` : ""}
            </footer>
        `: ""}
    `;
}

initTodos();

function initTodos() {
  itemsList.innerHTML = `
        ${currentTodos
          .map(
            (todo) => `
            <li
                class="todo-item ${todo.completed ? "completed" : ""}"
                data-todo-id="${todo.id}"
            >
                <input
                    id="todo-${todo.id}"
                    type="checkbox"
                    class="toggle"
                    ${todo.completed ? "checked" : ""}
                >
                <label for="todo-${todo.id}">${todo.title}</label>
                <button class="destroy"></button>
            </li>
            `
          )
          .join("")}
    `;

  updateInfo();
}

function updateInfo() {
  const activeTogglers = root.querySelectorAll(".toggle:not(:checked)");
  const completedTogglers = root.querySelectorAll(".toggle:checked");
  const footer = root.querySelector(".footer");
  const toggleAllContainer = root.querySelector(".toggle-all-container");
  const counter = root.querySelector(".todo-count");
  counter.innerHTML = `${activeTogglers.length} items left`;
  allToggler.checked = activeTogglers.length === 0;
  clearCompletedButton.hidden = completedTogglers.length === 0;

  const hasTodos = completedTogglers.length > 0 || activeTogglers.length > 0;
  footer.hidden = !hasTodos;
  toggleAllContainer.hidden = !hasTodos;
  console.log(currentTodos);
}

//add todo
newTodoField.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') {
        return;
    }

    if (!newTodoField.value) {
        return;
    }

    console.log(newTodoField.value)

    const id = +new Date();

    currentTodos.push({
        id: id,
        title: newTodoField.value,
        completed: false,
    });

    initTodos()

    newTodoField.value = '';

    updateInfo();
})

//remove todo
itemsList.addEventListener('click', (event) => {
    if (!event.target.matches('.destroy')) {
        return;
    }

    const item = event.target.closest(".todo-item");
    currentTodos = currentTodos.filter(todo => todo.id !== +item.dataset.todoId);

    initTodos();
    updateInfo();
})

//toggle todo status
itemsList.addEventListener('change', (event) => {
    if (!event.target.matches('.toggle')) {
        return;
    }

    const item = event.target.closest(".todo-item");
    const selectedTodo = currentTodos.find(todo => todo.id === +item.dataset.todoId);
    selectedTodo.completed = event.target.checked;

    initTodos();
    updateInfo();
});

//clear completed todos
clearCompletedButton.addEventListener('click', () => {
    currentTodos = currentTodos.filter(todo => !todo.completed);
    initTodos();
    updateInfo();
})

//toggle all
allToggler.addEventListener('change', () => {
    currentTodos.forEach(todo => {
        todo.completed = allToggler.checked;
    });

    initTodos();
    updateInfo();
})

//filter todos
filter.addEventListener('click', (event) => {
    if (!event.target.dataset.filter) {
        return;
    }

    const filterButtons = root.querySelectorAll('[data-filter]');
    for (const button of filterButtons) {
        button.classList.toggle('selected', event.target === button);
    }

    const togglers = root.querySelectorAll('.toggle');

    for (const toggler of togglers) {
        const item = toggler.closest('.todo-item');

        switch (event.target.dataset.filter) {
            case 'all':
                item.hidden = false;
                break

            case 'active':
                item.hidden = toggler.checked;
                break;

            case 'completed':
                item.hidden = !toggler.checked;
                break;
        }
    }
})
'use strict';

let currentTodos = [
    { id: 1, title: 'HTML', completed: false },
    { id: 2, title: 'CSS', completed: false },
    { id: 3, title: 'Javascript', completed: true },
];

const root = document.querySelector('.todoapp'); //base root element (section);
const newTodoField = root.querySelector('.new-todo');
const itemsList = root.querySelector('.todo-list');
const allToggler = root.querySelector(".toggle-all");
const clearCompletedButton = root.querySelector('.clear-completed');
const filter = root.querySelector('.filters');

initTodos(currentTodos);

function initTodos(todos) {
  for (const todo of todos) {
    itemsList.insertAdjacentHTML(
      "beforeend",
      `
            <li class="todo-item ${todo.completed ? "completed" : ""}" data-todo-id="${todo.id}"
            >
                <input
                    type="checkbox"
                    ${todo.completed ? "checked" : ""} 
                    class="toggle"
                    id="todo-${todo.id}"
                >
                <label for="todo-${todo.id}">${todo.title}</label>
                <button class="destroy"></button>
            </li>
        `
    );
  }
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

    itemsList.insertAdjacentHTML("beforeend", `
        <li class="todo-item" data-todo-id="${id}">
            <input
                type="checkbox"
                class="toggle"
                id="todo-${id}">
            <label for="todo-${id}">${newTodoField.value}</label>
            <button class="destroy"></button>
        </li>
    `);

    newTodoField.value = '';

    updateInfo();
})

//remove todo
itemsList.addEventListener('click', (event) => {
    if (!event.target.matches('.destroy')) {
        return;
    }

    const item = event.target.closest(".todo-item");
    item.remove();

    currentTodos = currentTodos.filter(todo => todo.id !== +item.dataset.todoId);
    updateInfo();
})

//toggle todo status
itemsList.addEventListener('change', (event) => {
    if (!event.target.matches('.toggle')) {
        return;
    }

    const item = event.target.closest(".todo-item");
    item.classList.toggle('completed', event.target.checked);
    const selectedTodo = currentTodos.find(todo => todo.id === +item.dataset.todoId);
    selectedTodo.completed = event.target.checked;

    updateInfo();
});

//clear completed todos
clearCompletedButton.addEventListener('click', () => {
    const completedTogglers = root.querySelectorAll(".toggle:checked");

    for (const toggler of completedTogglers) {
        toggler.closest('.todo-item').remove();
    }

    currentTodos = currentTodos.filter(todo => !todo.completed);
    updateInfo();
})

//toggle all
allToggler.addEventListener('change', () => {
    const togglers = root.querySelectorAll(".toggle");

    for (const toggler of togglers) {
        toggler.checked = allToggler.checked;
        toggler.closest(".todo-item").classList.toggle("completed", allToggler.checked);
    }

    currentTodos.forEach(todo => {
        todo.completed = allToggler.checked;
    });

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
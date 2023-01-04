'use strict';

const root = document.querySelector('.todoapp'); //base root element (section);

const newTodoField = root.querySelector('.new-todo');
const itemsList = root.querySelector('.todo-list');
const allToggler = root.querySelector(".toggle-all");

function updateInfo() {
    const notCompletedTogglers = root.querySelectorAll('.toggle:not(:checked)');
    const counter = root.querySelector('.todo-count');
    counter.innerHTML = `${notCompletedTogglers.length} items left`;

    allToggler.checked = notCompletedTogglers.length === 0;
}

allToggler.addEventListener('change', (event) => {
    if (allToggler.checked) {
        const togglers = root.querySelectorAll('.toggle');

        for (const toggler of togglers) {
            toggler.checked = true;
            toggler.closest('.todo-item').classList.add('completed');
        }
    }
})

newTodoField.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') {
        return;
    }

    if (!newTodoField.value) {
        return;
    }

    console.log(newTodoField.value)

    const id = +new Date();

    itemsList.insertAdjacentHTML(
      'beforeend',
      `
    <li class='todo-item'>
        <input type='checkbox' class='toggle' id='todo-${id}'>
        <label for='todo-${id}'>${newTodoField.value}</label>
        <button class='destroy'></button>
    </li>
    `
    );

    newTodoField.value = '';

    updateInfo();
})

itemsList.addEventListener('click', (event) => {
    if (!event.target.matches('.destroy')) {
        return;
    }

    event.target.closest('.todo-item').remove();
    updateInfo();
})

itemsList.addEventListener('click', (event) => {
  if (!event.target.matches('.toggle')) {
    return;
  }

  event.target.closest('.todo-item').classList.toggle('completed', event.target.checked);
    
  updateInfo();
});
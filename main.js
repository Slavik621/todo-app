let lists = JSON.parse(localStorage.getItem('todoLists')) || {};
let currentList = Object.keys(lists)[0] || null;

const listSelect = document.getElementById('list-select');
const listNameInput = document.getElementById('list-name');
const newListBtn = document.getElementById('new-list');
const newTaskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

function renderLists() {
  listSelect.innerHTML = '';
  for (let name in lists) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    listSelect.appendChild(option);
  }
  if (currentList) {
    listSelect.value = currentList;
    renderTasks();
  }
}

function renderTasks() {
    taskList.innerHTML = '';
    if (!currentList) return;
  
    let filteredTasks = lists[currentList];
  
    if (currentFilter === 'done') {
      filteredTasks = filteredTasks.filter(task => task.done);
    } else if (currentFilter === 'not-done') {
      filteredTasks = filteredTasks.filter(task => !task.done);
    }
  
    filteredTasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = 'task';
      li.innerHTML = `
        <label>
          <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${index})">
          <span style="text-decoration:${task.done ? 'line-through' : 'none'}">${task.text}</span>
        </label>
        <button onclick="deleteTask(${index})">🗑️</button>
      `;
      taskList.appendChild(li);
    });
  }
  
let currentFilter = 'all';

document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    renderTasks();
  });
});


function toggleTask(index) {
  lists[currentList][index].done = !lists[currentList][index].done;
  saveAndRender();
}

function deleteTask(index) {
  lists[currentList].splice(index, 1);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('todoLists', JSON.stringify(lists));
  renderTasks();
}

newListBtn.addEventListener('click', () => {
  const name = listNameInput.value.trim();
  if (name && !lists[name]) {
    lists[name] = [];
    currentList = name;
    saveAndRender();
    renderLists();
    listNameInput.value = '';
  }
});

addTaskBtn.addEventListener('click', () => {
  const text = newTaskInput.value.trim();
  if (text && currentList) {
    lists[currentList].push({ text, done: false });
    newTaskInput.value = '';
    saveAndRender();
  }
});

listSelect.addEventListener('change', () => {
  currentList = listSelect.value;
  renderTasks();
});

renderLists();

const deleteListBtn = document.getElementById('delete-list');

deleteListBtn.addEventListener('click', () => {
  if (!currentList) return;
  const confirmed = confirm(`Видалити список "${currentList}"?`);
  if (confirmed) {
    delete lists[currentList];
    const keys = Object.keys(lists);
    currentList = keys.length ? keys[0] : null;
    saveAndRender();
    renderLists();
  }
});

const themeSwitch = document.getElementById('theme-switch');

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-theme');
  themeSwitch.checked = true;
}

themeSwitch.addEventListener('change', () => {
  if (themeSwitch.checked) {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
});

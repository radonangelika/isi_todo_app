async function fetchTasks() {
  const res = await fetch('/api/tasks');
  const tasks = await res.json();
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.text;
    if (t.completed) li.style.textDecoration = 'line-through';
    li.onclick = () => toggleTask(t._id, !t.completed);
    const del = document.createElement('button');
    del.textContent = '🗑️';
    del.onclick = e => { e.stopPropagation(); deleteTask(t._id); };
    li.appendChild(del);
    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById('taskInput');
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: input.value })
  });
  input.value = '';
  fetchTasks();
}

async function toggleTask(id, completed) {
  await fetch('/api/tasks/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch('/api/tasks/' + id, { method: 'DELETE' });
  fetchTasks();
}

fetchTasks();

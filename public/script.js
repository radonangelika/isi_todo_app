// Pobiera zadania z backendu i wyświetla je na stronie
async function fetchTasks() {
  // Wysyłam żądanie GET do API, aby pobrać wszystkie zadania
  const res = await fetch('/api/tasks');
  const tasks = await res.json();
   // Oczyszczam listę przed jej ponownym zapełnieniem
  const list = document.getElementById('taskList');
  list.innerHTML = '';
   // Iteracja po każdym zadaniu i tworzy element listy
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.text;
    // Jeśli zadanie jest ukończone, dodaje przekreślenie
    if (t.completed) li.style.textDecoration = 'line-through';
     // Po kliknięciu na element <li>, przełącza status ukończenia
    li.onclick = () => toggleTask(t._id, !t.completed);
     // Tworzy przycisk usuwania
    const del = document.createElement('button');
    del.textContent = '🗑️';
    // Kliknięcie przycisku usuwa zadanie, ale nie aktywuje onclick z <li>
    del.onclick = e => { e.stopPropagation(); deleteTask(t._id); };// Zapobiega aktywowaniu zdarzenia kliknięcia <li>
    // Dodajemy przycisk do elementu <li>
    li.appendChild(del);
    // Dodajemy element <li> do listy
    list.appendChild(li);
  });
}
// Dodaje nowe zadanie
async function addTask() {
  const input = document.getElementById('taskInput');
   // Wysyłamy żądanie POST z treścią zadania jako JSON
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: input.value })
  });
  input.value = '';// Czyścimy pole inputa
  fetchTasks();// Odświeżamy listę zadań
}
// Przełącza status ukończenia zadania (true/false)
async function toggleTask(id, completed) {
  // Wysyłamy żądanie PUT z nowym stanem `completed`
  await fetch('/api/tasks/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  fetchTasks();// Odświeżamy listę
}
// Usuwa zadanie o danym ID
async function deleteTask(id) {
  await fetch('/api/tasks/' + id, { method: 'DELETE' });
  fetchTasks(); // Odświeżamy listę
}
// Po załadowaniu skryptu, od razu ładujemy istniejące zadania
fetchTasks();

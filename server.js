// Importujemy wymagane moduły
const express = require('express');            // Framework do tworzenia API
const mongoose = require('mongoose');          // ODM do MongoDB
const Task = require('./models/Task');         // Model danych Task (zadanie)
const app = express();                         // Tworzymy instancję aplikacji Express
require('dotenv').config();                    // Wczytujemy zmienne środowiskowe z pliku .env

// Middleware
app.use(express.json());                       // Automatyczne parsowanie JSON w ciele zapytań
app.use(express.static('public'));             // Serwuje pliki statyczne z katalogu "public"

// Połączenie z MongoDB Atlas przez URI w .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))   // Sukces
  .catch(err => console.log(err));               // Błąd połączenia

// ===== ROUTES API =====

// Pobierz wszystkie zadania
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();          // Pobierz wszystkie zadania z bazy danych
    res.json(tasks);                          // Wyślij je jako JSON do klienta
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Dodaj nowe zadanie
app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);          // Utwórz nowe zadanie z danych klienta
    await task.save();                        // Zapisz do MongoDB
    res.json(task);                           // Wyślij nowo utworzone zadanie z powrotem
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Zmień status ukończenia lub treść zadania
app.put('/api/tasks/:id', async (req, res) => {
  try {
    // Znajdź zadanie po ID i zaktualizuj je nowymi danymi (np. completed: true)
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);                       // Wyślij zaktualizowany dokument
  } catch (error) {
    console.error('PUT /api/tasks/:id error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Usuń zadanie
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);  // Znajdź i usuń zadanie po ID
    res.sendStatus(204);                          // Brak treści = OK, ale nic nie zwracamy
  } catch (error) {
    console.error('DELETE /api/tasks/:id error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


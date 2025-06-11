// Import biblioteki Mongoose do pracy z MongoDB
const mongoose = require('mongoose');
// Tworzenie nowego schematu dla dokumentu Task
const TaskSchema = new mongoose.Schema({
  text: String,
  // Pole 'completed' określa, czy zadanie jest ukończone
  // Domyślnie jest ustawione na 'false'
  completed: { type: Boolean, default: false }
});
// Eksportujemy model Mongoose o nazwie 'Task'
// Będzie używany do tworzenia, odczytu, aktualizacji i usuwania zadań w bazie danych
module.exports = mongoose.model('Task', TaskSchema);


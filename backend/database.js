const Database = require('better-sqlite3');

const db = new Database('./banco.db');

db.exec(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  cep TEXT,
  endereco TEXT
)`);

db.exec(`CREATE TABLE IF NOT EXISTS treinos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  descricao TEXT,
  horario TEXT NOT NULL,
  vagas INTEGER NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS agendamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  treino_id INTEGER,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (treino_id) REFERENCES treinos(id)
)`);

console.log('Banco de dados conectado!');

module.exports = db;

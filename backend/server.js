const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Cadastro de usuário
app.post('/usuarios', (req, res) => {
  const { nome, email, senha, cep, endereco } = req.body;
  try {
    const stmt = db.prepare(`INSERT INTO usuarios (nome, email, senha, cep, endereco) VALUES (?, ?, ?, ?, ?)`);
    const result = stmt.run(nome, email, senha, cep, endereco);
    res.json({ id: result.lastInsertRowid, mensagem: 'Usuário cadastrado!' });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  try {
    const row = db.prepare(`SELECT * FROM usuarios WHERE email = ? AND senha = ?`).get(email, senha);
    if (!row) return res.status(401).json({ erro: 'Email ou senha incorretos' });
    res.json({ mensagem: 'Login realizado!', usuario: row });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Listar treinos
app.get('/treinos', (req, res) => {
  try {
    const rows = db.prepare(`SELECT * FROM treinos`).all();
    res.json(rows);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Cadastrar treino
app.post('/treinos', (req, res) => {
  const { titulo, descricao, horario, vagas } = req.body;
  try {
    const stmt = db.prepare(`INSERT INTO treinos (titulo, descricao, horario, vagas) VALUES (?, ?, ?, ?)`);
    const result = stmt.run(titulo, descricao, horario, vagas);
    res.json({ id: result.lastInsertRowid, mensagem: 'Treino cadastrado!' });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Agendar treino
app.post('/agendamentos', (req, res) => {
  const { usuario_id, treino_id } = req.body;
  try {
    const stmt = db.prepare(`INSERT INTO agendamentos (usuario_id, treino_id) VALUES (?, ?)`);
    const result = stmt.run(usuario_id, treino_id);
    res.json({ id: result.lastInsertRowid, mensagem: 'Treino agendado!' });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Listar agendamentos de um usuário
app.get('/agendamentos/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  try {
    const rows = db.prepare(`
      SELECT treinos.titulo, treinos.horario FROM agendamentos
      JOIN treinos ON agendamentos.treino_id = treinos.id
      WHERE agendamentos.usuario_id = ?
    `).all(usuario_id);
    res.json(rows);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});

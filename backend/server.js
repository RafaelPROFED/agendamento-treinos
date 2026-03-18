const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Cadastro de usuário
app.post('/usuarios', (req, res) => {
  const { nome, email, senha, cep, endereco } = req.body;
  db.run(
    `INSERT INTO usuarios (nome, email, senha, cep, endereco) VALUES (?, ?, ?, ?, ?)`,
    [nome, email, senha, cep, endereco],
    function (err) {
      if (err) return res.status(400).json({ erro: err.message });
      res.json({ id: this.lastID, mensagem: 'Usuário cadastrado!' });
    }
  );
});

// Login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  db.get(
    `SELECT * FROM usuarios WHERE email = ? AND senha = ?`,
    [email, senha],
    (err, row) => {
      if (err) return res.status(400).json({ erro: err.message });
      if (!row) return res.status(401).json({ erro: 'Email ou senha incorretos' });
      res.json({ mensagem: 'Login realizado!', usuario: row });
    }
  );
});

// Listar treinos
app.get('/treinos', (req, res) => {
  db.all(`SELECT * FROM treinos`, [], (err, rows) => {
    if (err) return res.status(400).json({ erro: err.message });
    res.json(rows);
  });
});

// Cadastrar treino (admin)
app.post('/treinos', (req, res) => {
  const { titulo, descricao, horario, vagas } = req.body;
  db.run(
    `INSERT INTO treinos (titulo, descricao, horario, vagas) VALUES (?, ?, ?, ?)`,
    [titulo, descricao, horario, vagas],
    function (err) {
      if (err) return res.status(400).json({ erro: err.message });
      res.json({ id: this.lastID, mensagem: 'Treino cadastrado!' });
    }
  );
});

// Agendar treino
app.post('/agendamentos', (req, res) => {
  const { usuario_id, treino_id } = req.body;
  db.run(
    `INSERT INTO agendamentos (usuario_id, treino_id) VALUES (?, ?)`,
    [usuario_id, treino_id],
    function (err) {
      if (err) return res.status(400).json({ erro: err.message });
      res.json({ id: this.lastID, mensagem: 'Treino agendado!' });
    }
  );
});

// Listar agendamentos de um usuário
app.get('/agendamentos/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  db.all(
    `SELECT treinos.titulo, treinos.horario FROM agendamentos
     JOIN treinos ON agendamentos.treino_id = treinos.id
     WHERE agendamentos.usuario_id = ?`,
    [usuario_id],
    (err, rows) => {
      if (err) return res.status(400).json({ erro: err.message });
      res.json(rows);
    }
  );
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

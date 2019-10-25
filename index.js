const express = require('express');

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request Body = { "name": "Kelsey Júnior", "email": "kelseytfjunior@gmail.com" }

// CRUD - Create, Read, Update, Delete

const users = ['Diego', 'Cláudio', 'Victor'];

// Middleware global

server.use((req, res, next) => {
  console.log('A requisição foi chamada!');
  return next();
})

// Middleware local

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User not found on request body' });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if(!user) {
    return res.status(400).json({ error: 'User does not exist' });
  }
  req.user = user;
  return next();
}

server.get('/users', (req, res) => {
  // http://localhost:3000/users
  return res.json(users);
})

server.get('/users/:index', checkUserInArray, (req, res) => {
  // http://localhost:3000/users/1
  return res.json(req.user);
});

server.post('/users', checkUserExists, (req, res) => {
  // http://localhost:3000/users
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  // http://localhost:3000/users/1
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
})

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);

  return res.send();
})

server.listen(3000);

/*
Requisição normal
server.get('/teste', (req, res) => {
  // http://localhost:3000/teste

  // return res.send('Hello World')
  return res.json({ message: 'Hello World' });
});
*/

/*
// Query params
server.get('/teste', (req, res) => {
  // http://localhost:3000/teste?nome=Kelsey
  const { nome } = req.query;
  return res.json({ message: `Hello ${nome}` });
});

// Route params
server.get('/users/:id', (req, res) => {
  // http://localhost:3000/users/1
  const { id } = req.params;
  return res.json({ message: `Buscando o usuário ${id}` });
});
*/
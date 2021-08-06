const express = require('express');
const usuarios = require('./controllers/usuarios');
const pokemons = require('./controllers/pokemons');
const login = require('./controllers/login');

const routes = express();

routes.post('/usuarios', usuarios.cadastrarUsuario);
routes.post('/login', login.login);

module.exports = routes;
const express = require('express');
const usuarios = require('./controllers/usuarios');
const pokemons = require('./controllers/pokemons');

const routes = express();

//usuarios
routes.post('/usuarios', usuarios.cadastrarUsuario);

module.exports = routes;
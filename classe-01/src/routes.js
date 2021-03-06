const express = require('express');
const usuarios = require('./controllers/usuarios');
const pokemons = require('./controllers/pokemons');
const login = require('./controllers/login');
const verificaLogin = require('./filters/verificaLogin');

const routes = express();

routes.post('/usuarios', usuarios.cadastrarUsuario);
routes.post('/login', login.login);

routes.use(verificaLogin);

routes.post('/pokemons', pokemons.cadastrarPokemon);
routes.get('/pokemons', pokemons.listarPokemons);
routes.get('/pokemons/:id', pokemons.listarPokemonPorId);
routes.patch('/pokemons/:id', pokemons.atualizarPokemon);
routes.delete('/pokemons/:id', pokemons.deletarPokemon);

module.exports = routes;
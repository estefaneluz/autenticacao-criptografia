CREATE DATABASE catalogo_pokemons;

CREATE TABLE IF NOT EXISTS usuarios(
  id serial PRIMARY KEY,
  nome varchar(50) NOT NULL,
  email varchar(100) UNIQUE NOT NULL, 
  senha text NOT NULL
);

CREATE TABLE IF NOT EXISTS pokemons(
  id serial PRIMARY KEY,
  usuario_id int NOT NULL,
  nome varchar(50) NOT NULL,
  habilidades text NOT NULL,
  imagem text,
  apelido varchar(50),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
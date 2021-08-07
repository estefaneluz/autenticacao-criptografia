const conexao = require('../connection');

const cadastrarPokemon = async (req, res) => {
    const { nome, habilidades, imagem, apelido } = req.body;
    const {id: usuario_id } = req.usuario;

    if(!nome) return res.status(400).json("O campo nome é obrigatório.");
    if(!habilidades) return res.status(400).json("O campo habilidades é obrigatório.");  

    try {
        const pokemon = await conexao.query(
            "INSERT INTO pokemons(usuario_id, nome, habilidades, imagem, apelido) VALUES($1, $2, $3, $4, $5)", [usuario_id, nome, habilidades, imagem, apelido]);
        if(!pokemon.rowCount) return res.status(400).json("Não foi possível cadastrar o pokemon.");
        return res.status(200).json("Pokemon cadastrado!");
    } catch(error){
        return res.status(400).json(error.message);
    }
}

const listarPokemons = async (req, res) => {
    const { id } = req.usuario;

    try {
        const query = `
        SELECT p.id, u.nome as usuario, p.nome, p.apelido, p.habilidades, p.imagem FROM pokemons p 
        JOIN usuarios u ON u.id = p.usuario_id AND p.usuario_id = $1`
        const {rows: pokemons} = await conexao.query(query, [id]);

        for(const pokemon of pokemons){
            pokemon.habilidades = pokemon.habilidades.split(', ');
        }

        return res.status(200).json(pokemons);
    } catch(error){
        return res.status(400).json(error.message);
    }
}

const listarPokemonPorId = async (req, res) => {
    const { id } = req.params;
    const { id: usuario_id } = req.usuario;
    try {
        const pokemon = await conexao.query(
            `SELECT p.id, u.nome as usuario, p.nome, p.apelido, p.habilidades, p.imagem FROM pokemons p 
            JOIN usuarios u ON u.id = p.usuario_id 
            AND p.usuario_id = $1 AND p.id = $2`, [usuario_id, id]);
        if(!pokemon.rowCount) return res.status(404).json("Pokemon não encontrado.");
        return res.status(200).json(pokemon.rows[0]);
    } catch(error){
        return res.status(400).json(error.message);
    }
}

const atualizarPokemon = async (req, res) => {
    const { id } = req.params;
    const { apelido } = req.body;
    const { id: usuario_id } = req.usuario;

    if(!apelido) return res.status(400).json("É preciso informar o novo apelido.");
    
    try {
        const pokemon = await conexao.query(
            `SELECT FROM pokemons WHERE id = $1 AND usuario_id = $2`,
            [id, usuario_id]
        );
        if(!pokemon.rowCount) return res.status(400).json("Pokemon não encontrado");

        const pokemonAtualizado = await conexao.query(
            `UPDATE pokemons SET apelido = $1 WHERE id = $2 AND usuario_id = $3`,
            [apelido, id, usuario_id]
        );
        if(!pokemonAtualizado.rowCount) return res.status(400).json("Não foi possível atualizar o pokemon.");

        return res.status(200).json("Pokemon atualizado.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const deletarPokemon = async (req, res) => {
    const { id } = req.params;
    const { id: usuario_id } = req.usuario;

    try {
        const pokemon = await conexao.query(
            "SELECT * FROM pokemons WHERE id = $1 AND usuario_id = $2",
            [id, usuario_id]);
        if(!pokemon.rowCount) return res.status(404).json("Pokemon não encontrado.");

        const pokemonDeletado = await conexao.query(
            "DELETE FROM pokemons WHERE id = $1 AND usuario_id = $2",
            [id, usuario_id]
        );
        if(!pokemonDeletado.rowCount) return res.status(400).json("Não foi possível deletar o pokemon.");

        return res.status(200).json("Pokemon deletado com sucesso!");
    } catch(error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { cadastrarPokemon, listarPokemons, listarPokemonPorId, atualizarPokemon, deletarPokemon }
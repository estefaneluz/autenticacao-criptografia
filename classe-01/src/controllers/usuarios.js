const conexao = require('../connection');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    if(!nome) return res.status(400).json("É necessário informar o nome.");
    if(!email) return res.status(400).json("É necessário informar o e-mail.");
    if(!senha) return res.status(400).json("É necessário informar a senha.");

    try {
        const emailUnico = await conexao.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if(emailUnico){
            return res.status(400).json("Esse e-mail já existe.")
        }


    } catch(error){
        return res.status(error.status).json(error.message);
    }
}

module.exports = { cadastrarUsuario };
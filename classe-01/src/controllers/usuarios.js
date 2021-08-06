const conexao = require('../connection');
const securePassword = require('secure-password');
const pwd = securePassword();

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    if(!nome) return res.status(400).json("É necessário informar o nome.");
    if(!email) return res.status(400).json("É necessário informar o e-mail.");
    if(!senha) return res.status(400).json("É necessário informar a senha.");

    try {
        const emailUnico = await conexao.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if(emailUnico.rowCount > 0){
            return res.status(400).json("Esse e-mail já existe.")
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
        const usuario = await conexao.query("INSERT INTO usuarios(nome, email, senha) VALUES($1, $2, $3)",[nome, email, hash]);

        if(!usuario.rowCount) return res.status(400).json("Não foi possível cadastrar o usuário");

        return res.status(200).json("Usuário cadastrado com sucesso.");
    } catch(error){
        return res.status(error.status).json(error.message);
    }
}

module.exports = { cadastrarUsuario };
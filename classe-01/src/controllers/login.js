const conexao = require('../connection')
const securePassword = require('secure-password');
const pwd = securePassword();

const login = async (req, res) => {
    const {email, senha} = req.body;

    if(!email || !senha) return res.status(400).json("É preciso informar o e-mail e a senha.");

    try {
        const { rows, rowCount } = await conexao.query("SELECT * FROM usuarios WHERE email = $1", [email]);

        if(!rowCount) {
            return res.status(404).json("E-mail ou senha incorretos.");
        }

        const usuario = rows[0];
        const resultado = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"));
        
        switch(resultado){
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json("E-mail ou senha incorretos.")
            case securePassword.VALID:
                break
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
                    await conexao.query("UPDATE usuarios SET senha = $1 WHERE email = $2)",[hash, email]);
                } catch {
                } 
                break;
        }

        return res.status(200).json(`heyyy!! Tudo bem? O seu nome é ${usuario.nome}`);
    } catch(error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { login }
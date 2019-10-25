import logger from './logger';

module.exports = (req, res, error) => {

    if (error.name && error.name === 'SequelizeValidationError') {
        if (error.message.includes('Validation error: Validation is on cnpj failed')) return res.status(400).send({ ok: false, message: 'invalid-cnpj', userMessage: "Cnpj inválido" });
        if (error.message.includes('Validation error: Validation isIn on type failed')) return res.status(400).send({ ok: false, message: 'invalid-type', userMessage: "Tipo inválido" });
        if (error.message.includes('Validation error: Validation is on phone failed')) return res.status(400).send({ ok: false, message: 'invalid-phone', userMessage: "Telefone inválido" });
        if (error.message.includes('Validation error: Validation is on owner_phone failed')) return res.status(400).send({ ok: false, message: 'invalid-owner_phone', userMessage: "Telefone do responsável inválido" });
        if (error.message.includes('invalid input syntax for type timestamp with time zone: \"Invalid date\"')) return res.status(400).send({ ok: false, message: 'invalid-date', userMessage: "Data inválida" });
        if (error.message.includes('Validation error: Validation is on cpf failed')) return res.status(400).send({ ok: false, message: 'invalid-cpf', userMessage: "CPF inválido" });
        if (error.message.includes('Validation error: Validation is on postalCode failed')) return res.status(400).send({ ok: false, message: 'invalid-postalCode', userMessage: "CEP inválido" });

    }
    if (error.errors && error.errors[0] && error.errors[0].message) return res.status(400).send({ ok: false, message: error.errors[0].message });
    else if (error.name && error.name === "invalid-reference") return res.status(400).send({ ok: false, message: error.message });
    else if (error.name && error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).send({ ok: false, message: error.message });
    }

    else return res.status(400).send({ ok: false, message: error.message, userMessage: error.userMessage });
}



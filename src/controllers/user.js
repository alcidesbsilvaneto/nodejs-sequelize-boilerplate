import { Router } from 'express';

import { User } from '../models';
import handleSequelizeError from '../util/handleSequelizeError';
import logger from '../util/logger';
import { getUserFromJwt } from '../middlewares/index'

export default () => {
    const api = Router();

    api.post('/register', getUserFromJwt, async (req, res) => {
        if (req.body.name &&
            req.body.email &&
            req.body.password) {

            let user = {
                name: req.body.name.toUpperCase(),
                email: req.body.email,
                password: req.body.password,
            };

            let newUser = null;
            try {
                newUser = await User.create(user);
                logger.info({ message: 'user-registered', obj: newUser });
                return res.status(201).send({ ok: true, message: 'ok' });
            } catch (error) {
                logger.error({ message: "user-register-error", raw: error });
                return handleSequelizeError(req, res, error);
            }
        }
        else if (!req.body.name) return res.status(400).send({ ok: false, message: 'missing-name', userMessage: "Nome obrigatório" });
        else if (!req.body.email) return res.status(400).send({ ok: false, message: 'missing-email', userMessage: "Email obrigatório" });
        else if (!req.body.password) return res.status(400).send({ ok: false, message: 'missing-password', userMessage: "Senha obrigatória" });
    });

    api.put('/', getUserFromJwt, async (req, res) => {
        if (!res.locals.user) return res.status(400).send({ ok: false, message: "invalid-token" });
    })

    return api;
}


import { Router } from 'express';
import passport from 'passport';
import crypto from 'crypto';
import Sequelize from 'sequelize';
import moment from 'moment';
import bcrypt from 'bcryptjs';

import { User } from '../models';
import { sendResetPasswordMail } from '../services/mail';

import { generateAccessToken, respond, handleAuthError } from '../middlewares/auth';
import { getUserFromJwt } from '../middlewares';

const Op = Sequelize.Op;

export default () => {
    const api = Router();

    api.post('/', passport.authenticate('local', { session: false }), handleAuthError, generateAccessToken, respond);

    api.post('/forgot_password', async (req, res, next) => {
        User.getUserByEmail(req.body.email, (err, user) => {
            if (!user) return res.status(400).send({ ok: false, message: 'user-not-found' });
            crypto.randomBytes(20, (err, buffer) => {
                var token = buffer.toString('hex');
                var today = moment();
                var tomorrow = moment(today).add(1, 'days');
                User.update(
                    { reset_password_token: token, reset_password_expires: tomorrow },
                    { where: { id: user.id } }
                ).then(function (rowsUpdated) {
                    if (rowsUpdated < 1) return res.status(500).send({ ok: false, message: 'error-updating-user-token' });
                    sendResetPasswordMail(user.email, user.name, 'http://localhost:3000/resetar_senha?token=' + token, (err, info) => {
                        if (err) return res.status(500).send({ ok: false, message: err.message });
                        return res.send({ ok: true, message: '' });
                    });
                }).catch(error => {
                    console.log(error);
                    return res.status(500).send({ ok: false, message: 'internal-error' })
                })

            });
        });
    });

    api.post('/password_reset', (req, res) => {
        if (!req.body.token) return res.status(400).send({ ok: false, message: 'missing-token' });
        if (!req.body.password) return res.status(400).send({ ok: false, message: 'missing-password' });
        if (!req.body.repassword) return res.status(400).send({ ok: false, message: 'missing-password-confirmation' });
        User.findOne({
            where: {
                reset_password_token: req.body.token,
                reset_password_expires: {
                    [Op.gt]: moment()
                }
            }
        }).then(user => {
            if (!user) return res.status(400).send({ ok: false, message: 'token-not-found-or-expired', userMessage: 'Token inválido' });
            if (req.body.password !== req.body.repassword) return res.status(400).send({ ok: false, message: 'passwords-not-matching', userMessage: 'Suas senhas não conferem' });

            user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null);
            user.reset_password_token = null;
            user.reset_password_expires = null;
            user.save().then(user => {
                return res.json({ ok: true, message: '' });
            });
        }).catch(error => {
            return res.json({ ok: true, message: error.message });
        });

    });

    api.get('/validatejwt', getUserFromJwt, (req, res) => {
        if (!res.locals.user) return res.status(401).send({ ok: false, message: 'expired-token' });
        return res.send({ ok: true });
    });

    return api;
}


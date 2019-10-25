import jwt from 'jsonwebtoken';
import { User } from '../models';

let isAdmin = (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({ ok: false, error: 'unauthorized' });
    var token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
        if (err) {
            if (err.name && err.name === "TokenExpiredError") return res.status(401).json({ ok: false, error: 'token-expired' })
            return res.status(401).json({ ok: false, error: 'unauthorized' })
        };
        if (!decoded || decoded.type !== 'admin') return res.status(401).json({ ok: false, error: 'unauthorized' });
        next();
    });
}

let getUserFromJwt = function (req, res, next) {
    if (!req.headers.authorization) return next();
    var token = req.headers.authorization.split(' ')[1];
    let user = null;
    try {
        user = jwt.verify(token, process.env.APP_SECRET);
    } catch (error) {
        if (error.message === 'jwt expired') return res.status(401).send({ ok: false, message: 'token-expired' });
        return res.status(401).send({ ok: false, message: error.message });
    }
    User.getUserById(user.id, (err, user) => {
        if (err) return res.status(422).json({ ok: false, message: 'error-getting-user' });
        res.locals.user = user;
        next();
    });
}



module.exports = {
    getUserFromJwt,
    isAdmin
}
import jwt from 'jsonwebtoken';

const TOKENTIME = 60 * 60 * 24 * 1; // 7 Days

let handleAuthError = (err, req, res, next) => {
    if (err) {
        if (err.message === 'user-not-found') return res.status(401).send({ ok: false, message: 'user-not-found' });
        if (err.message === 'wrong-password') return res.status(401).send({ ok: false, message: 'wrong-password' });
    }
    next();
}

let generateAccessToken = (req, res, next) => {
    req.token = req.token || {};
    req.token = jwt.sign({ id: req.user.id }, process.env.APP_SECRET, { expiresIn: TOKENTIME });
    next();
}

let respond = (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            ok: false,
        })
    }
    return res.status(200).json({
        ok: true,
        user: req.user.name,
        type: req.user.type,
        token: req.token,
    });
}

module.exports = {
    handleAuthError,
    generateAccessToken,
    respond
}
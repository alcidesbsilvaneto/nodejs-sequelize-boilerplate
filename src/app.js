import dotenv from 'dotenv';
// Setting .env file
dotenv.config({
    path: process.env.NODE_ENV === 'test' ? process.env.PWD + '/.env.test' : process.env.PWD + '/.env'
});

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import passport from 'passport';
import expressJwt from 'express-jwt';
import cors from 'cors';

import config from './config';
import routes from './routes';

import { User } from './models';
import logger from './util/logger';

const app = express();

app.server = http.createServer(app);

app.use(bodyParser.json({
    limit: config.bodyLimit
}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// Locking routes
app.use(expressJwt({ credentialsRequired: true, secret: process.env.APP_SECRET, requestProperty: 'auth' }).unless({ path: config.PUBLIC_URLs }));

//Passport config
app.use(passport.initialize());
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function (email, password, done) {
        User.getUserByEmail(email, function (err, user) {
            if (err) return done(err, false);
            if (!user) return done();
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) return done(err);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done();
                }
            });
        });
    }
));
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});
console.log(process.env.PWD + '/logs/logs.json');
//Error handler
app.use(function (err, req, res, next) {
    console.log('ERRO FATAL')
    console.log(err);
    logger.error({ message: "general-error-handler", raw: err });
    if (err.name === 'UnauthorizedError') {
        if (err.message) {
            switch (err.message) {
                case 'jwt expired':
                    err.message = 'token-expired';
                    break;
                case 'No authorization token was found':
                    err.message = 'missing-token';
                    break;
                case 'invalid signature':
                    err.message = 'invalid-token';
                    break;
                default:
                    break;
            }
        }
        return res.status(err.status).send({ ok: false, message: err.message });
    }
    next();
});


app.use('/static', express.static('public'))
app.use('/v1', routes);


module.exports = app;
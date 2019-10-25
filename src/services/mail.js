let email = process.env.MAILER_EMAIL_ID;
let pass = process.env.MAILER_PASSWORD;

let nodemailer = require('nodemailer');

//GMAIL 
let transporter = nodemailer.createTransport({
    //host: 'smtp.exchangecorp.com.br',
    service: 'gmail',
    //port: 587,
    //secure: false,
    auth: {
        user: email,
        pass: pass
    }
});

import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export let sendRegisterMail = (to) => {
    let source = fs.readFileSync(path.join(__dirname, '..', 'templates', `new_user.hbs`), 'utf8');
    let hbsTemplate = Handlebars.compile(source);
    let options = {
        from: `"APPNAME" <alcides.striker@gmail.com>`,
        to: to,
        subject: 'Bem vindo',
        html: hbsTemplate({})
    }
    transporter.sendMail(options, (err, info) => {
        if (err) return callback(err, null);
        return callback(null, info)
    })
}

export let sendResetPasswordMail = (to, username, resetUrl, callback) => {
    let source = fs.readFileSync(path.join(__dirname, '..', 'templates', `reset_password.hbs`), 'utf8');
    let hbsTemplate = Handlebars.compile(source);
    let options = {
        from: `"APPNAME" <alcides.striker@gmail.com>`,
        to: to,
        subject: 'Recuperação de senha',
        html: hbsTemplate({ username, resetUrl })
    }
    transporter.sendMail(options, (err, info) => {
        if (err) return callback(err, null);
        return callback(null, info)
    })
}

export let sendEmail = (to, locals, template, subject, callback) => {
    let source = fs.readFileSync(path.join(__dirname, '..', 'templates', `${template}.hbs`), 'utf8');
    let hbsTemplate = Handlebars.compile(source);
    let options = {
        from: `"APPNAME" <alcides.striker@gmail.com>`,
        to: to,
        subject: subject,
        html: hbsTemplate(locals)
    }
    transporter.sendMail(options, (err, info) => {
        if (err) return callback(err, null);
        return callback(null, info)
    })
}
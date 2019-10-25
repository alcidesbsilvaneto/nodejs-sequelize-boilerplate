import bcrypt from 'bcryptjs';

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'missing-name'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'missing-name'
                }
            },
            allowNull: false,
        },
        delete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        active: { type: DataTypes.BOOLEAN, defaultValue: true },
        password: DataTypes.STRING,
        reset_password_token: DataTypes.STRING,
        reset_password_expires: DataTypes.DATE,
        type: {
            type: DataTypes.STRING,
            defaultValue: "user"
        }
    }, { underscored: true });

    User.beforeCreate((user, options) => {
        return User.findOne({ where: { email: user.email, delete: false } }).then(checkUser => {
            if (checkUser) return Promise.reject({ name: 'unique-validator', message: 'email-already-taken', userMessage: 'Este email já está em uso' });
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
        });
    });

    User.getUserById = (id, callback) => {
        User.findOne({ where: { id }, include: 'address' }).then(user => {
            if (!user) return callback(new Error('user-not-found'), null);
            return callback(null, user);
        });
    };

    User.getUserByEmail = (email, callback) => {
        User.findOne({ where: { email, delete: false, active: true } }).then(user => {
            if (!user) return callback(new Error('user-not-found'), null);
            return callback(null, user);
        });
    };

    User.comparePassword = (candidatePassword, hash, callback) => {
        bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
            if (err) return callback(err, null);
            if (!isMatch) return callback(new Error('wrong-password'), null);
            callback(null, isMatch);
        });
    };

    return User;
}
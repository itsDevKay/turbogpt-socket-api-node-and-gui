// import bcrypt from 'bcryptjs';
const argon2 = require('argon2');
import prisma from '../../lib/prisma'
import jwt from 'jsonwebtoken'
require('dotenv').config()

/* JWT secret key */
const KEY = process.env.JWT_KEY;
/* Users collection sample */

export default (req, res) => {
    return new Promise(resolve => {
        const { method } = req;
        try {
            switch (method) {
                case 'POST':
                    /* Get Post Data */
                    const { email, password } = req.body;
                    /* Any how email or password is blank */
                    if (!email || !password) {
                        return res.status(400).json({
                            status: 'error',
                            error: 'Request missing username or password',
                        });
                    }
                    /* Check user email in database */
                    prisma.users.findMany({
                        where: {
                            email: {
                                contains: req.body.email.toLowerCase().trim(),
                            },
                        },
                    }).then(users => {
                        console.log(users)
                        const user = users[0]
                        /* Check if exists */
                        if (!user) {
                            /* Send error with message */
                            res.status(400).json({ status: 'error', error: 'User Not Found' });
                        }
                        /* Variables checking */
                        if (user) {
                            const userId = user.id,
                            userEmail = user.email,
                            userPassword = user.password,
                            userCreated = user.createdAt;
                            /* Check and compare password */
                            argon2.verify(userPassword, password).then(isMatch => {
                                /* User matched */
                                if (isMatch) {
                                    /* Create JWT Payload */
                                    const payload = {
                                        id: userId,
                                        email: userEmail,
                                        createdAt: userCreated,
                                    };
                                    /* Sign token */
                                    jwt.sign(
                                        payload,
                                        KEY,
                                    {
                                        expiresIn: 25200 // 7 days in seconds
                                    },
                                    (err, token) => {
                                        /* Send succes with token */
                                        res.status(200).json({
                                            success: true,
                                            token: 'Bearer ' + token,
                                        });
                                    },
                                );
                                } else {
                                    /* Send error with message */
                                    res.status(400).json({ status: 'error', error: 'Password incorrect' });
                                }
                            });
                        }
                    })
                    break
                case 'PUT':
                    break;
                case 'PATCH':
                    break;
                default:
                    break;
            }
        } catch (error) {
            throw error;
        }
        return resolve();
    });
};
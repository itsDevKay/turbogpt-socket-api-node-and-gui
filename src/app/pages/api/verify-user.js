import prisma from '../../lib/prisma'
const argon2 = require('argon2');

// POST /api/verify-user
// Required fields in body: name, email
export default async function handle(req, res) {
    if (req.method == 'POST') {
        try {
            if (true) {
                // password match
                const users = await prisma.users.findMany({
                    where: {
                        email: {
                          contains: req.body.email.toLowerCase().trim(),
                        },
                    },
                })
                const user = users[0]
                if (user) {
                    const passwordsMatch = await argon2.verify(user.password, req.body.password)
                    if (passwordsMatch) {
                        res.json({
                            valid: true
                        })
                    } else {
                        res.json({ message: 'Invalid username or password', status_code: 403 })
                    }
                } else {
                    res.json({ message: 'No user found with that email', status_code: 403 })
                }
            } else {
                res.json({ message: 'Invalid username or password', status_code: 403 })
            }
        } catch (err) {
            console.log(err)
            res.json({ message: err })
        }
    } else {
        res.json({ message: 'Invalid method', status_code: 403 })
    }
}

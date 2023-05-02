import prisma from '../../lib/prisma'
const argon2 = require('argon2');

// POST /api/user
// Required fields in body: name, email
export default async function handle(req, res) {
    if (req.method == 'POST') {
        // encrypt password
        try {
            const hash = await argon2.hash(req.body.password)
            const result = await prisma.users.create({
                data: {
                    first_name: req.body.first_name.trim(),
                    last_name: req.body.last_name.trim(),
                    email: req.body.email.toLowerCase().trim(),
                    password: hash
                }
            })
            res.json({
                message: 'Account created successfully',
                user_id: result.id
            })
        } catch (err) {
            res.json({ message: err })
        }
    } else {
        res.json({ message: 'Invalid method', status_code: 403 })
    }
}

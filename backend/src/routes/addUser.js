const db = require('../persistence');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) return res.status(400).send({ error: 'email and password required' });
    if (typeof email !== 'string' || typeof password !== 'string') return res.status(400).send({ error: 'invalid input' });
    if (password.length < 6) return res.status(400).send({ error: 'password too short' });

    try {
        const existing = await db.getUserByEmail(email);
        if (existing) return res.status(409).send({ error: 'user already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = { id: uuid(), email, password: hashed };
        await db.storeUser(user);
        // omit password when returning
        const { password: _, ...safe } = user;
        res.status(201).send(safe);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'internal error' });
    }
};

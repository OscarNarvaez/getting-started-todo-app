const db = require('../persistence');

module.exports = async (req, res) => {
    try {
        const user = await db.getUser(req.params.id);
        if (!user) return res.status(404).send({ error: 'not found' });
        const { password, ...safe } = user;
        res.send(safe);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'internal error' });
    }
};

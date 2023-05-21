const express = require('express');
const { userMiddleware } = require('./utils');
const userDao = require('./dao/UserDao')

function get(app) {
    app.get('/me', async (req, res) => {
        try {
            const user = await userDao.findUserById(req.userId);
            if (!user)
                return res.status(404).end();
            res.status(200).json(user.toSafeJson()).end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });
    return app;
}

module.exports = function (app) {
    app.use(`/user*`, userMiddleware);

    app.use('/user', get(express.Router()));
}
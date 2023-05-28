const express = require('express');
const { userMiddleware } = require('./utils');

function get(app) {
    app.get('/main', async (req, res) => {
        try {

            res.status(200).json().end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });
    return app;
}

module.exports = function (app, redisClient) {
    app.use(`/environment*`, userMiddleware);
    app.use('/environment', get(express.Router(), redisClient));
}
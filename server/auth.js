const express = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const { genGuid, genTokens } = require('./utils');
const userDao = require('./dao/UserDao');

function get(app, redisClient) {
    app.post('/login/email', async (req, res) => {
        try {
            let email = (req.body.email || '').trim();
            let password = req.body.password || '';
            const fcm = req.body.fcm || null;

            if (!password || !email)
                return res.status(400).json({ error: 3 }).end();

            const user = await userDao.findUserByEmail(email);

            if (user === null)
                return res.status(404).end();

            if (!await bcrypt.compare(password, user.password))
                return res.status(403).end();

            if (fcm)
                await userDao.addFcmToken(user.id, fcm);

            const { access, refresh } = genTokens(user.id);
            await userDao.addRefreshToken(user.id, refresh);

            res.status(200).json({ access: access, refresh: refresh, user: user.toSafeJson() }).end();
        } catch (error) {
            res.status(500).json({ error: 500 }).end();
        }
    });

    app.post('/signup/telegram', async (req, res) => {
        try {
            const fcm = req.body.token || null;

            if (!fcm)
                return res.status(400).end();

            const guid = genGuid(56);
            const n = `ldt_2023:via_telegram:${guid}`;
            await redisClient.set(n, fcm);
            await redisClient.expire(n, 600);

            res.status(200).json({ link: `${config.get('telegram').link}?start=lvt_${guid}` }).end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

    app.post('/signup/emailFirst', async (req, res) => {
        try {
            const email = req.body.email || null;

            if (!email)
                return res.status(400).end();

            if (await userDao.checkEmailExists(email))
                return res.status(409).end();

            let code = '';
            for (let i = 0; i < 5; i++)
                code += '0123456789'[Math.floor(Math.random() * 10)];

            const n = `ldt_2023:email:${email}`;
            await redisClient.set(n, code);
            await redisClient.expire(n, 600);

            res.status(200).json().end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

    app.post('/signup/emailSecond', async (req, res) => {
        try {
            const name = (req.body.name || '').trim();
            const email = (req.body.email || '').trim();
            const code = req.body.code || '';
            const password = req.body.password || '';
            const attraction = req.body.attraction || null;
            const fcm = req.body.fcm || null;

            if (!name || !email || !password || !code)
                return res.status(400).end();

            if (await userDao.checkEmailExists(email))
                return res.status(409).end();

            const n = `ldt_2023:email:${email}`;
            if (code !== await redisClient.get(n))
                return res.status(403).end();

            await redisClient.del(n);

            const user = await userDao.createUserFromEmail(name, email, password, attraction);

            if (fcm)
                await userDao.addFcmToken(user.id, fcm);

            const { access, refresh } = genTokens(user.id);
            await userDao.addRefreshToken(user.id, refresh);

            res.status(200).json({ access, refresh, user: user.toSafeJson() }).end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

    return app;
}

module.exports = function (app, redisClient) {
    app.use('/auth', get(express.Router(), redisClient));
}
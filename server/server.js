const express = require('express');
const config = require('config');
const bodyParser = require("body-parser");
const redis = require('redis');
const cors = require('cors');
const jsonParser = bodyParser.json();
const app = express();
const PORT = config.get('port');

const redisClient = redis.createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().then(() => console.log('REDIS CONNECTED'));

app.use(jsonParser);

app.use(cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Set-Cookie'],
    credentials: true,
}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

require('./user')(app);
require('./auth')(app, redisClient);

app.use(async (req, res) => res.status(404).end());

app.listen(PORT, '127.0.0.1', () => console.log(`Example app listening on port ${PORT}`));
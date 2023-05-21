const jwt = require("jsonwebtoken");
const config = require("config");

function genGuid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

const getUserId = (token) => +jwt.verify(token, config.get('jwt'), { algorithms: ["HS256"] }).id;
const genTokens = (userId) => ({
    access: jwt.sign({ id: userId }, config.get('jwt'), { expiresIn: '14d', algorithm: "HS256" }),
    refresh: genGuid(60),
});

function userMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token)
            return res.status(400).end();
        
        const userId = getUserId(token);

        if (!userId)
            return res.status(401).end();

        req.userId = userId;
        next();
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError)
            return res.status(401).end();
    }
}

module.exports = {
    genGuid,
    getUserId,
    genTokens,
    userMiddleware,
}
const pool = require('../db');
const bcrypt = require("bcrypt");

const { genGuid } = require("../utils");

const MAX_USER_NAME_LENGTH = 100;

class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.telegram = data.telegram_id ? {
            id: data.telegram_id,
            chat: data.telegram_chat_id,
            nickname: data.telegram_username,
        } : null;
        this.vk = data.vk_id ? {
            id: data.vk_id,
        } : null;
        this.inviteLink = data.invite_link;
    }

    toSafeJson() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            telegram: this.telegram,
            vk: this.vk,
            inviteLink: this.inviteLink,
        }
    }
}

class UserDao {
    async checkEmailExists(email) {
        return (await pool.query('SELECT EXISTS(SELECT id FROM user WHERE email = ?) AS err', [email]))[0][0].err;
    }

    async findUserById(id) {
        const res = (await pool.query(
            `SELECT id,
                    name,
                    email,
                    password,
                    telegram_id,
                    telegram_chat_id,
                    vk_id,
                    invite_link
             FROM user
             WHERE id = ?`,
            [id]))[0][0];

        if (!res)
            return null;

        return new User(res);
    }

    async findUserByEmail(email) {
        const res = (await pool.query(
            `SELECT id,
                    name,
                    email,
                    password,
                    telegram_id,
                    telegram_chat_id,
                    vk_id,
                    invite_link
             FROM user
             WHERE email = ?`,
            [email]))[0][0];

        if (!res)
            return null;

        return new User(res);
    }

    async createUserFromEmail(name, email, password, attraction = null) {
        try {
            const passwordHash = await bcrypt.hash(password, 8);
            name = name.substring(0, MAX_USER_NAME_LENGTH);

            let inviteLink;
            do {
                inviteLink = genGuid(30);
            } while ((await pool.query('SELECT EXISTS(SELECT id FROM user WHERE invite_link = ?) err', [inviteLink]))[0][0].err);

            const res = (await pool.query('INSERT INTO user (name, email, password, invite_link, attraction) VALUES (?, ?, ?, ?, ?)', [name, email, passwordHash, inviteLink, attraction]))[0];

            return await this.findUserById(res.insertId);
        } catch (e) {
            return null;
        }
    }

    async addFcmToken(userId, fcm) {
        await pool.query('DELETE FROM user_fcm WHERE user_id = ?', [userId]);
        await pool.query('INSERT INTO user_fcm (user_id, token) VALUES (?, ?)', [userId, fcm]);
    }

    async addRefreshToken(userId, token) {
        await pool.query('DELETE FROM refresh_token WHERE user_id = ?', [userId]);
        await pool.query('INSERT INTO refresh_token (user_id, token) VALUES (?, ?)', [userId, token]);
    }
}

module.exports = new UserDao();

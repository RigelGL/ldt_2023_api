const express = require('express');
const { userMiddleware } = require('./utils');
const courseDao = require('./dao/CourseDao');

function get(app) {
    app.get('/filters', async (req, res) => {
        try {
            res.status(200).json(await courseDao.getFilters()).end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

    app.post('/search', async (req, res) => {
        try {
            const courses = await courseDao.findCourses();

            res.status(200).json(courses).end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

    app.get('/:id(\\d+)', async (req, res) => {
        try {
            const id = req.params.id;

            if (!id)
                return res.status(400).end();

            res.status(200).json(await courseDao.getCourse(id)).end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

    app.get('/:id(\\d+)/lessons', async (req, res) => {
        try {
            const id = req.params.id;

            if (!id)
                return res.status(400).end();

            res.status(200).json(await courseDao.getCourseLessons(id)).end();
        } catch (e) {
            console.log(e);
            res.status(500).end();
        }
    });

    return app;
}

module.exports = function (app, redisClient) {
    app.use(`/course*`, userMiddleware);
    app.use('/course', get(express.Router(), redisClient));
}
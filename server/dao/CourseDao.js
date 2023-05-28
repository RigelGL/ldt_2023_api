const pool = require('../db');

class Course {

}


class CourseDao {
    async getFilters() {
        const main = [];
        const commonTags = [];
        const map = {};
        (await pool.query('SELECT id, name, description, color FROM course_main_category'))[0].forEach(e => {
            const category = {
                id: e.id,
                name: e.name,
                description: e.description,
                color: e.color,
                tags: [],
            };
            main.push(category);
            map[e.id] = category;
        });
        (await pool.query('SELECT id, name, description, main_category_id mid, color FROM course_tag'))[0].forEach(e => {
            const tag = {
                id: e.id,
                name: e.name,
                description: e.description,
                color: e.color,
            };
            if (e.mid)
                map[e.mid].tags.push(tag);
            else
                commonTags.push(e);
        });

        return {categories: main, commonTags: commonTags};
    }

    async findCourses(offset, limit, params) {
        params ||= {};
        const mainCategoryId = params.main;
        const tags = params.tags || [];
        const name = params.name || null;
        const age = params.age || null;
        const difficulty = params.difficulty || [];
        const duration = params.duration || null;
        const type = params.type || null;

        const courses = (await pool.query(
            `SELECT c.id,
                    c.name,
                    main_category_id mc_id,
                    age_min,
                    age_max,
                    difficulty,
                    duration,
                    type,
                    address,
                    cmc.name         mc_name,
                    cmc.color        mc_color
             FROM course c
                      INNER JOIN course_main_category cmc ON c.main_category_id = cmc.id`))[0].map(e => ({
            id: e.id,
            name: e.name,
            mainCategory: {
                id: e.mc_id,
                name: e.mc_name,
                color: e.mc_color,
            },
            address: e.address,
            age: {
                min: e.age_min,
                max: e.age_max,
            },
            difficulty: e.difficulty,
            duration: e.duration,
            type: e.type,
            tags: [],
        }));

        if (courses.length > 0) {
            const map = new Map();
            courses.forEach(e => map.set(e.id, e));
            (await pool.query(
                `SELECT id, name, color, ttc.course_id cid
                 FROM course_tag
                          INNER JOIN tag_to_course ttc ON course_tag.id = ttc.tag_id
                 WHERE ttc.course_id IN (?)`,
                [courses.map(e => e.id)]))[0].forEach(e => {
                map.get(e.cid).tags.push({
                    id: e.id,
                    name: e.name,
                    color: e.color,
                    textColor: e.textColor,
                });
            })
        }
        return courses;
    }

    async getUserActiveCourses(userId) {
        const courses = (await pool.query(
            `SELECT c.id,
                    c.name,
                    main_category_id mc_id,
                    age_min,
                    age_max,
                    duration,
                    type,
                    difficulty,
                    cmc.name         mc_name,
                    cmc.color        mc_color
             FROM course c
                      INNER JOIN course_main_category cmc ON c.main_category_id = cmc.id
                      INNER JOIN user_course uc on c.id = uc.course_id
             WHERE uc.user_id = ?
               AND uc.finished IS FALSE`, [userId]))[0].map(e => ({
            id: e.id,
            name: e.name,
            mainCategory: {
                id: e.mc_id,
                name: e.mc_name,
                color: e.mc_color,
            },
            age: {
                min: e.age_min,
                max: e.age_max,
            },
            difficulty: e.difficulty,
            duration: e.duration,
            type: e.type,
            tags: [],
        }));

        if (courses.length > 0) {
            const map = new Map();
            courses.forEach(e => map.set(e.id, e));
            (await pool.query(
                `SELECT id, name, color, ttc.course_id cid
                 FROM course_tag
                          INNER JOIN tag_to_course ttc ON course_tag.id = ttc.tag_id
                 WHERE ttc.course_id IN (?)`,
                [courses.map(e => e.id)]))[0].forEach(e => {
                map.get(e.cid).tags.push({
                    id: e.id,
                    name: e.name,
                    color: e.color,
                    textColor: e.textColor,
                });
            })
        }

    }

    async getCourse(id) {
        const e = (await pool.query(
            `SELECT c.id,
                    c.name,
                    c.description,
                    main_category_id mc_id,
                    age_min,
                    age_max,
                    duration,
                    type,
                    difficulty,
                    address,
                    cmc.name         mc_name,
                    cmc.color        mc_color
             FROM course c
                      INNER JOIN course_main_category cmc ON c.main_category_id = cmc.id
             WHERE c.id = ?`, [id]))[0][0];

        if (!e)
            return null;

        return {
            id: e.id,
            name: e.name,
            description: e.description,
            address: e.address,
            mainCategory: {
                id: e.mc_id,
                name: e.mc_name,
                color: e.mc_color,
            },
            age: {
                min: e.age_min,
                max: e.age_max,
            },
            difficulty: e.difficulty,
            duration: e.duration,
            type: e.type,
            tags: (await pool.query(
                `SELECT id, name, color
                 FROM course_tag
                          INNER JOIN tag_to_course ttc ON course_tag.id = ttc.tag_id
                 WHERE ttc.course_id = ?`, [id]))[0].map(e => ({
                id: e.id,
                name: e.name,
                color: e.color,
                textColor: e.textColor,
            })),
            lessons: (await pool.query(
                `SELECT id, title, estimated_minutes
                 FROM course_lesson
                 WHERE course_id = ?
                 ORDER BY sort_index`, [id]))[0].map(e => ({
                id: e.id,
                title: e.title,
                estimatedMinutes: e.estimated_minutes,
            })),
            modules: (await pool.query(
                `SELECT id, description, lesson_start, lesson_end
                 FROM course_module
                 WHERE course_id = ?`, [id]))[0].map(e => ({
                id: e.id,
                description: e.description,
                lessonStart: e.lesson_start,
                lessonEnd: e.lesson_end,
            }))
        };
    }

    async getCourseLessons(id) {
        const lessons = (await pool.query(
            `SELECT id, title, text, link, estimated_minutes
             FROM course_lesson
             WHERE course_id = ?
             ORDER BY sort_index`, [id]))[0].map(e => ({
            id: e.id,
            title: e.title,
            text: e.text,
            link: e.link,
            estimatedMinutes: e.estimated_minutes,
            tasks: [],
        }));

        if (lessons.length > 0) {
            const lMap = new Map();
            lessons.forEach(e => lMap.set(e.id, e));
            const someOf = [];
            const map = new Map();
            (await pool.query(
                `SELECT id, lesson_id lid, title, type
                 FROM lesson_task
                 WHERE lesson_id IN (?)`, [lessons.map(e => e.id)],
            ))[0].forEach(e => {
                const task = {
                    id: e.id,
                    title: e.title,
                    type: e.type,
                    some: e.type === 'some_of' ? [] : undefined,
                };
                lMap.get(e.lid).tasks.push(task);
                map.set(e.id, task);
                if (e.type === 'some_of')
                    someOf.push(e.id);
            });
            if (someOf.length > 0) {
                (await pool.query('SELECT id, task_id tid, text, is_right, image, audio FROM task_some_of WHERE task_id IN (?)', someOf))[0].forEach(e => {
                    map.get(e.tid).some.push({
                        id: e.id,
                        text: e.text,
                        isRight: e.is_right,
                        image: e.image,
                        audio: e.audio,
                    });
                });
            }
        }

        return {
            lessons,
            modules: (await pool.query(
                `SELECT id, description, lesson_start, lesson_end
                 FROM course_module
                 WHERE course_id = ?`, [id]))[0].map(e => ({
                id: e.id,
                description: e.description,
                lessonStart: e.lesson_start,
                lessonEnd: e.lesson_end,
            }))
        };
    }
}

module.exports = new CourseDao();
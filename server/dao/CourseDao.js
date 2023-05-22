const pool = require('../db');

class Course {

}


class CourseDao {
    async getFilters() {
        const main = [];
        const commonTags = [];
        const map = {};
        (await pool.query('SELECT id, name, description, color, text_color FROM course_main_category'))[0].forEach(e => {
            const category = {
                id: e.id,
                name: e.name,
                description: e.description,
                color: e.color,
                textColor: e.text_color,
                tags: [],
            };
            main.push(category);
            map[e.id] = category;
        });
        (await pool.query('SELECT id, name, description, main_category_id mid, color, text_color FROM course_tag'))[0].forEach(e => {
            const tag = {
                id: e.id,
                name: e.name,
                description: e.description,
                color: e.color,
                textColor: e.textColor,
            };
            if (e.mid)
                map[e.mid].tags.push(tag);
            else
                commonTags.push(e);
        });

        const difficulties = (await pool.query('SELECT id, name, value, color, text_color FROM course_difficulty'))[0].map(e => ({
            id: e.id,
            name: e.name,
            value: e.value,
            color: e.color,
            textColor: e.textColor,
        }));

        return { categories: main, commonTags: commonTags, difficulties };
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
                    c.description,
                    main_category_id mc_id,
                    age_min,
                    age_max,
                    difficulty_id    d_id,
                    duration,
                    type,
                    cmc.name         mc_name,
                    cmc.color        mc_color,
                    cmc.text_color   mc_tcolor,
                    d.name           d_name,
                    d.value          d_value,
                    d.color          d_color,
                    d.text_color     d_tcolor
             FROM course c
                      INNER JOIN course_main_category cmc ON c.main_category_id = cmc.id
                      INNER JOIN course_difficulty d ON c.difficulty_id = d.id
            `))[0].map(e => ({
            id: e.id,
            name: e.name,
            mainCategory: {
                id: e.mc_id,
                name: e.mc_name,
                color: e.mc_color,
                textColor: e.mc_tcolor,
            },
            age: {
                min: e.min_age,
                max: e.max_age,
            },
            difficulty: {
                id: e.d_id,
                name: e.d_name,
                value: e.d_value,
                color: e.d_color,
                textColor: e.d_tcolor,
            },
            duration: {
                days: e.duration,
            },
            type: e.type,
            tags: [],
        }));


        if (courses.length > 0) {
            const map = new Map();
            courses.forEach(e => map.set(e.id, e));
            (await pool.query(
                `SELECT id, name, color, text_color, ttc.course_id cid
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
}

module.exports = new CourseDao();
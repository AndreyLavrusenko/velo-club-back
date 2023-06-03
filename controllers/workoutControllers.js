const createError = require("../error.js");
const {pool} = require("../db.js");
const getWorkout = async (req, res, next) => {
    try {
        if (req.headers.workout_id) {

            const sql = "SELECT * FROM workout WHERE id = ?"
            const data = [req.headers.workout_id]

            pool.query(sql, data, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                if (result.length === 0) {
                    return res.status(200).json({resultCode: 1, message: 'Тренировка не найдена'})
                } else {
                    return res.status(200).json({resultCode: 0, data: result})
                }
            })

        }

    } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}

module.exports = {
    getWorkout
}
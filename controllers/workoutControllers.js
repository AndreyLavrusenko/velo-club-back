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
                    result[0].workout = JSON.parse(result[0].workout)
                    return res.status(200).json({resultCode: 0, data: result})
                }
            })

        }

    } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}


const getWorkoutInfo = async (req, res, next) => {
    try {

        if (req.headers.workout_id) {

            const sql = "SELECT is_start, active_stage, time_start FROM workout WHERE id = ?"
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


const startWorkout = async (req, res, next) => {
    try {
        if (req.headers.workout_id) {

            const date = Date.now()

            const sql = "UPDATE workout SET is_start = ?, active_stage = ?, time_start = ? WHERE id = ?"
            const data = [1, 1, date, req.headers.workout_id]

            pool.query(sql, data, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                return res.status(200).json({resultCode: 0})
            })

        }
    } catch (err) {
        next(createError(400, 'Что-то пошло не так'))
    }
}


const resetWorkout = async (req, res, next) => {
    try {
        if (req.headers.workout_id) {

            const sql = "UPDATE workout SET is_start = ?, active_stage = ?, time_start = ? WHERE id = ?"
            const data = [0, 0, null, req.headers.workout_id]

            pool.query(sql, data, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                return res.status(200).json({resultCode: 0})
            })

        }
    } catch (err) {
        next(createError(400, 'Что-то пошло не так'))
    }
}


const goToNextStage = async (req, res, next) => {
    try {

        if (req.headers.workout_id) {

            const sqlGetAllStage = "SELECT workout FROM workout WHERE id = ?"
            const dataGetAllStage = [req.headers.workout_id]

            pool.query(sqlGetAllStage, dataGetAllStage, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                const workoutLength = JSON.parse(result[0].workout).length;
                const nextStage = req.body.current_stage + 1

                // Если еще не дошли до последнего этапа
                if (req.body.current_stage < workoutLength) {

                    const sqlNextStage = "UPDATE workout SET active_stage = ? WHERE id = ?"
                    const dataNextStage = [nextStage, req.headers.workout_id]

                    pool.query(sqlNextStage, dataNextStage, async (error, result) => {
                        if (error) return res.status(400).json({message: error, resultCode: 1})

                        return res.status(200).json({resultCode: 0, active_stage: nextStage})
                    })

                } else if (req.body.current_stage === workoutLength) {
                    const sqlEndWorkout = "UPDATE workout SET active_stage = ?, is_start = ?, time_start = ? WHERE id = ?"
                    const dataEndWorkout = [0, 0, null, req.headers.workout_id]

                    pool.query(sqlEndWorkout, dataEndWorkout, async (error, result) => {
                        if (error) return res.status(400).json({message: error, resultCode: 1})

                        return res.status(200).json({resultCode: 0, active_stage: 0})
                    })
                }
            })
        }

    } catch (err) {
        next(createError(400, 'Что-то пошло не так'))
    }
}


const getStartTime = async (req, res, next) => {
    try {

        if (req.headers.workout_id) {

            const sql = "SELECT time_start FROM workout WHERE id = ?"
            const data = [req.headers.workout_id]

            pool.query(sql, data, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                return res.status(200).json({resultCode: 0, time_start: result[0].time_start})
            })

        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так"))
    }
}


const updateWorkout = async (req, res, next) => {
    try {

        if (req.headers.workout_id) {

            const sql = "UPDATE workout SET workout = ? WHERE id = ?"
            const data = [JSON.stringify(req.body.workout), req.headers.workout_id]


            pool.query(sql, data, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                return res.status(200).json({resultCode: 0})
            })

        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так"))
    }
}


const getUpdateWorkout = async (req, res, next) => {
    try {

        if (req.headers.workout_id) {

            const sql = "SELECT workout FROM workout WHERE id = ?"
            const data = [req.headers.workout_id]


            pool.query(sql, data, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                if (result.length === 0) {
                    return res.status(200).json({resultCode: 1})
                } else {
                    return res.status(200).json({resultCode: 0, workout: JSON.parse(result[0].workout)})
                }
            })

        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так"))
    }
}



module.exports = {
    getWorkout,
    getWorkoutInfo,
    startWorkout,
    resetWorkout,
    goToNextStage,
    getStartTime,
    updateWorkout,
    getUpdateWorkout,
}
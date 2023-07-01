const createError = require("../error.js");
const {pool} = require("../db.js");
const jwt = require("jsonwebtoken");
const {v4: uuidv4} = require("uuid");

const createNewWorkout = (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken && req.body.workout_name) {

            const decoded = jwt.verify(authToken, process.env.SECRET_JWT)

            const workout_id = uuidv4()

            const isWorkoutClub = !!req.headers.admin;

            const sqlCreateWorkout = "INSERT INTO workout (id, trainer_id, workout, workout_name, is_club_workout) VALUES (?, ?, ?, ?, ?)"
            const dataCreateWorkout = [workout_id, decoded.id, JSON.parse(JSON.stringify('[]')), req.body.workout_name, isWorkoutClub]

            pool.query(sqlCreateWorkout, dataCreateWorkout, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                return res.status(201).json({
                    resultCode: 0,
                    workout_id
                })

            })
        } else {
            res.status(401).json({resultCode: 1})
        }


    } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}


const getAllUserWorkouts = (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            const decoded = jwt.verify(authToken, process.env.SECRET_JWT)

            const sqlGetAllWorkout = "SELECT id, is_start, active_stage, workout_name FROM workout WHERE trainer_id = ?"
            const data = [decoded.id]


            pool.query(sqlGetAllWorkout, data, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                return res.status(200).json({
                    resultCode: 0,
                    result
                })

            })
        } else {
            res.status(401).json({resultCode: 1})
        }

    } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}


const getActiveWorkout = (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            const decoded = jwt.verify(authToken, process.env.SECRET_JWT)

            const sqlGetCurrentActiveWorkout = "SELECT current_workout FROM trainers WHERE id = ?"
            const data = [decoded.id]


            pool.query(sqlGetCurrentActiveWorkout, data, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})


                let workoutRes = null
                if (result[0].current_workout) {
                    workoutRes = result[0].current_workout
                }

                return res.status(200).json({
                    resultCode: 0,
                    current_workout: workoutRes
                })

            })
        } else {
            res.status(401).json({resultCode: 1})
        }

    } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}


const setActiveWorkout = (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            if (!req.body.workout_id) return res.status(204).json({resultCode: 1})

            const decoded = jwt.verify(authToken, process.env.SECRET_JWT)

            const sqlGetCurrentActiveWorkout = "UPDATE trainers SET current_workout = ? WHERE id = ?"
            const data = [req.body.workout_id, decoded.id]


            pool.query(sqlGetCurrentActiveWorkout, data, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                return res.status(200).json({
                    resultCode: 0,
                    current_workout: req.body.workout_id
                })

            })
        } else {
            res.status(401).json({resultCode: 1})
        }

    } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}


const deleteWorkout = (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            if (!req.headers.workout_id) return res.status(204).json({resultCode: 1})

            const sqlGetCurrentActiveWorkout = "DELETE FROM workout WHERE id = ?"
            const data = [req.headers.workout_id]


            pool.query(sqlGetCurrentActiveWorkout, data, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                return res.status(200).json({resultCode: 0})

            })
        } else {
            res.status(401).json({resultCode: 1})
        }

    } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}


module.exports = {
    createNewWorkout,
    getAllUserWorkouts,
    getActiveWorkout,
    setActiveWorkout,
    deleteWorkout,
}
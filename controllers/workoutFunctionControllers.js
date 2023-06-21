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

            //TODO Возможно нудно будет сдлеать JSON.parse

            const sqlCreateWorkout = "INSERT INTO workout (id, trainer_id, workout, workout_name) VALUES (?, ?, ?, ?)"
            const dataCreateWorkout = [workout_id, decoded.id, JSON.parse(JSON.stringify('[]')), req.body.workout_name]

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

                return res.status(200).json({
                    resultCode: 0,
                    current_workout: result[0].current_workout
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


module.exports = {
    createNewWorkout,
    getAllUserWorkouts,
    getActiveWorkout,
    setActiveWorkout,
}
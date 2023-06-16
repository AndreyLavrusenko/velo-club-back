const createError = require("../error.js");
const {pool} = require("../db.js");
const jwt = require("jsonwebtoken");
const {v4: uuidv4} = require("uuid");

const createNewWorkout = (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            const decoded = jwt.verify(authToken, process.env.SECRET_JWT)

            const workout_id = uuidv4()

            //TODO Возможно нудно будет сдлеать JSON.parse

            const sqlCreateWorkout = "INSERT INTO workout (id, trainer_id, workout) VALUES (?, ?, ?)"
            const dataCreateWorkout = [workout_id, decoded.id, JSON.parse(JSON.stringify('[]'))]

            pool.query(sqlCreateWorkout, dataCreateWorkout, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                return res.status(201).json({
                    resultCode: 0,
                    workout_id
                })

            })
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
        }

        } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}


module.exports = {
    createNewWorkout,
    getAllUserWorkouts,
}
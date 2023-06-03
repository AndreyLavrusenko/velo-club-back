const router = require('express').Router()

const {getWorkout} = require("../controllers/workoutControllers.js");


router.get('/get-workout', getWorkout)

module.exports = router;
const router = require('express').Router()

const {
    getCreatedByUserClub,
    createClub,
    getAllClubs,
    joinToTheClub,
    getWorkoutClub
} = require("../controllers/clubControllers.js");


router.get('/get-created-by-user-club', getCreatedByUserClub)

router.post('/create-club', createClub)

router.get('/get-all-clubs', getAllClubs)

router.put('/join-to-the-club', joinToTheClub)

router.get('/get-workout-club', getWorkoutClub)

module.exports = router;
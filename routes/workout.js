const router = require('express').Router()

const {
    getWorkout,
    getWorkoutInfo,
    startWorkout,
    resetWorkout,
    goToNextStage,
    getStartTime,
    updateWorkout
} = require("../controllers/workoutControllers.js");

// Получает информацию о тренировке
router.get('/get-workout', getWorkout)

// Получает информацию о тренировки каждые пару секунд
router.get('/get-workout-info', getWorkoutInfo)

// Страт тренировки
router.put('/start-workout', startWorkout)

// Сбросить тренировку
router.put('/reset-workout', resetWorkout)

// Переход на новый этап
router.put('/go-next-stage', goToNextStage)

router.get('/get-start-time', getStartTime)

// Обновление тренировки
router.put('/update-workout', updateWorkout)

module.exports = router;
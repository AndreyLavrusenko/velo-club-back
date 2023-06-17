const router = require('express').Router()

const {
    getWorkout,
    getWorkoutInfo,
    startWorkout,
    resetWorkout,
    goToNextStage,
    getStartTime,
    updateWorkout,
    getUpdateWorkout
} = require("../controllers/workoutControllers.js");

const {
    createNewWorkout,
    getAllUserWorkouts,
    getActiveWorkout, setActiveWorkout
} = require("../controllers/workoutFunctionControllers.js");

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

// Получение обновленной тренировки
router.get('/get-update-workout', getUpdateWorkout)

// Создание тренировки
router.post('/create-workout', createNewWorkout)

// Получение всех тренировок, которые доступны пользователю
router.get('/get-all-user-workout', getAllUserWorkouts)

// Получает выбранную тренировку пользователя
router.get('/get-active-workout', getActiveWorkout)

// Устанавливает активную тренировку для пользователя
router.post('/set-active-workout', setActiveWorkout)

module.exports = router;
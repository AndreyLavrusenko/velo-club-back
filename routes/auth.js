const router = require('express').Router()

const {
    loginTrainer,
    registerTrainer,
    getUserInfo,
    changeUsername,
    changePassword
} = require("../controllers/authControllers.js");


router.post('/trainer-login', loginTrainer)

router.post('/trainer-reg', registerTrainer)

router.get('/get-user-info', getUserInfo)

router.put('/change-username', changeUsername)

router.put('/change-password', changePassword)

module.exports = router;
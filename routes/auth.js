const router = require('express').Router()

const {
    loginTrainer,
    registerTrainer,
    getUserInfo,
    changeUsername,
    changePassword,
    changePasswordUsingLogin
} = require("../controllers/authControllers.js");


router.post('/trainer-login', loginTrainer)

router.post('/trainer-reg', registerTrainer)

router.get('/get-user-info', getUserInfo)

router.put('/change-username', changeUsername)

router.put('/change-password', changePassword)

router.put('/change-password-using-login', changePasswordUsingLogin)

module.exports = router;
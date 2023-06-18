const router = require('express').Router()

const {loginTrainer, registerTrainer, getUserInfo} = require("../controllers/authControllers.js");


router.post('/trainer-login', loginTrainer)

router.post('/trainer-reg', registerTrainer)

router.get('/get-user-info', getUserInfo)

module.exports = router;
const router = require('express').Router()

const {loginTrainer, registerTrainer} = require("../controllers/authControllers.js");


router.post('/trainer-login', loginTrainer)

router.post('/trainer-reg', registerTrainer)

module.exports = router;
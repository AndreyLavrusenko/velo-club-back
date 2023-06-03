const router = require('express').Router()

const {loginTrainer} = require("../controllers/authControllers.js");


router.get('/trainer-login', loginTrainer)

module.exports = router;
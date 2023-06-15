const createError = require("../error.js");
const {pool} = require("../db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const {v4: uuidv4} = require('uuid');

const loginTrainer = async (req, res, next) => {
    try {
        if (req.body.login && req.body.password) {

            // Получаю пароль из бд по логину
            const sqlGetPas = "SELECT id, password FROM trainers WHERE login = ?"
            const dataGetPas = [req.body.login]

            pool.query(sqlGetPas, dataGetPas, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                if (result.length === 0) {
                    return res.status(200).json({resultCode: 1, message: 'Аккаунт с таким логином не найден'})
                } else {

                    const isPasswordCorrect = await bcrypt.compare(req.body.password, result[0].password)

                    if (isPasswordCorrect) {
                        const token = jwt.sign(
                            {id: result[0].id},
                            process.env.SECRET_JWT,
                            {expiresIn: '30d'}
                        )

                        return res
                            .cookie("access_token", token, {httpOnly: true})
                            .status(200)
                            .json({
                                resultCode: 0,
                                message: "Successfully Login",
                                token
                            })
                    } else {
                        return res.status(200).json({resultCode: 1, message: 'Неверный логин или пароль'})
                    }
                }
            })
        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так!"))
    }
}


const registerTrainer = async (req, res, next) => {
    try {
        if (req.body.login && req.body.password) {

            const sql = `SELECT * FROM trainers WHERE login = ?`
            const data = [req.headers.login]

            // Отправка запроса и его проверка
            pool.query(sql, data, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                // Если такого аккаунта нет, то созадем его
                if (result.length === 0) {

                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(req.body.password, salt)

                    const id = uuidv4()

                    const sqlCreate = "INSERT INTO trainers (id, login, password) VALUES (?, ?, ?)"
                    const dataCreate = [id, req.body.login, hashedPassword]

                    pool.query(sqlCreate, dataCreate, async (error, result) => {
                        if (error) return res.status(400).json({message: error, resultCode: 1})

                        // Записываем id тренера
                        const token = jwt.sign(
                            {id},
                            process.env.SECRET_JWT,
                            {expiresIn: '30d'}
                        )

                        return res
                            .cookie("access_token", token, {httpOnly: true})
                            .status(201)
                            .json({
                                resultCode: 0,
                                message: "Successfully Login",
                                token
                            })
                    })

                // Если аккаунт с такоим логином уже существует, то выводим ошибку
                } else {
                    return res.status(200).json({resultCode: 1, message: 'Такой аккаунт уже существует'})
                }
            })

        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так!"))
    }
}


module.exports = {
    loginTrainer,
    registerTrainer
}
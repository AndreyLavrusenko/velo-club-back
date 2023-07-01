const createError = require("../error.js");
const {pool} = require("../db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const {v4: uuidv4} = require('uuid');

const loginTrainer = async (req, res, next) => {
    try {
        if (req.body.login && req.body.password) {

            // Получаю пароль из бд по логину
            const sqlGetPas = "SELECT id, password, isAdmin FROM trainers WHERE login = ?"
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
                                token,
                                isAdmin: result[0].isAdmin
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


const getUserInfo = (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            const decoded = jwt.verify(authToken, process.env.SECRET_JWT)

            const sqlGetUserInfo = "SELECT login, clubs FROM trainers WHERE id = ?"
            const dataGetUserInfo = [decoded.id]

            pool.query(sqlGetUserInfo, dataGetUserInfo, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                if (result.length === 0) {
                    return res.status(200).json({resultCode: 0, message: "Не удалось найти информацию о пользователе"})
                } else {
                    const name = result[0].login

                    function getClubNameFromClubTable(arr, callback) {
                        const resultArray = [];
                        let pending = arr.length;
                        const sql2 = "SELECT id, name FROM club WHERE id = ?"

                        for (let i = 0; i < pending; i++) {
                            const data2 = [arr[i]];

                            pool.query(sql2, data2, (error, result) => {
                                if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

                                resultArray.push(...result)
                                if (0 === --pending) {
                                    callback(resultArray)
                                }
                            })
                        }
                    }

                    if (result[0].clubs) {
                        const parseClub = JSON.parse(result[0].clubs)

                        getClubNameFromClubTable(parseClub, resultArr => {
                            return res.status(200).json({result: {name, clubs: resultArr}, resultCode: 0})
                        })
                    } else {
                        return res.status(200).json({result: {name, clubs: []}, resultCode: 0})
                    }
                }
            })

        } else {
            return res.status(401).json({resultCode: 1, message: "Вы не авторизованы"})
        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так!"))
    }
}


const changeUsername = (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            const decoded = jwt.verify(authToken, process.env.SECRET_JWT)

            if (req.body.login) {

                const sql = `UPDATE trainers SET login = ? WHERE id = ?`
                const data = [req.body.login, decoded.id]

                // Отправка запроса и его проверка
                pool.query(sql, data, async (error, result) => {
                    if (error) return res.status(400).json({message: error, resultCode: 1})

                    return res.status(200).json({resultCode: 0, message: 'Логин успешно изменен'})
                })

            }

        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так!"))
    }
}


const changePassword = async (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            const decoded = jwt.verify(authToken, process.env.SECRET_JWT)

            if (req.body.password) {

                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(req.body.password, salt)

                const sql = "UPDATE trainers SET password = ? WHERE id = ?"
                const data = [hashedPassword, decoded.id]

                pool.query(sql, data, async (error, result) => {
                    if (error) return res.status(400).json({message: error, resultCode: 1})

                    return res.status(200).json({resultCode: 0, message: 'Пароль успешно изменен'})
                })

            }

        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так!"))
    }
}


const changePasswordUsingLogin = async (req, res, next) => {
    try {

        if (req.body.new_password && req.body.login) {

            const sqlFindByLogin = "SELECT id FROM trainers WHERE login = ?"
            const dataFindByLogin = [req.body.login]

            pool.query(sqlFindByLogin, dataFindByLogin, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                if (result.length > 0) {
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(req.body.new_password, salt)

                    const sql = "UPDATE trainers SET password = ? WHERE login = ?"
                    const data = [hashedPassword, req.body.login]

                    pool.query(sql, data, async (error, result) => {
                        if (error) return res.status(400).json({message: error, resultCode: 1})

                        return res.status(200).json({resultCode: 0, message: 'Пароль успешно изменен'})
                    })
                } else {
                    return res.status(200).json({message: error, resultCode: 1})
                }
            })
        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так!"))
    }
}


module.exports = {
    loginTrainer,
    registerTrainer,
    getUserInfo,
    changeUsername,
    changePassword,
    changePasswordUsingLogin,
}
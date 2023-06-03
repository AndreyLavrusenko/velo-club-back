const createError = require("../error.js");
const {pool} = require("../db.js");
const jwt = require("jsonwebtoken");

const loginTrainer = async (req, res, next) => {
    try {
        if (req.headers.login) {

            const sql = `SELECT * FROM trainers WHERE login = ?`
            const data = [req.headers.login]

            // Отправка запроса и его проверка
            pool.query(sql, data, async (error, result) => {
                if (error) return res.status(400).json({message: error, resultCode: 1})

                if (result.length === 0) {
                    return res.status(200).json({resultCode: 1, message: 'Акканута с таким логином не найден'})
                } else {
                    // Записываем id тренера
                    const token = jwt.sign(
                        {isTrainer: true, id: result[0].id},
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
                }
            })

        }

    } catch (err) {
        next(createError(400, "Что-то пошло не так!"))
    }
}


module.exports = {
    loginTrainer
}
const {pool} = require("../db.js");
const createError = require("../error.js");
const jwt = require("jsonwebtoken");
const {v4: uuidv4} = require("uuid");


const getCreatedByUserClub = async (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            const decoded = jwt.verify(authToken, process.env.SECRET_JWT)

            const sqlGetClub = "SELECT * FROM club WHERE owner = ?"
            const data = [decoded.id]


            pool.query(sqlGetClub, data, async (error, result) => {
                if (error) return res.status(200).json({message: error, resultCode: 1})


                if (result.length === 0) {
                    return res.status(200).json({resultCode: 1, message: "У вас еще нет клуба"})
                } else {
                    return res.status(200).json({
                        resultCode: 0,
                        club: result[0]
                    })
                }
            })

        } else {
            res.status(401).json({resultCode: 1})
        }

    } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}


const createClub = async (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            if (!req.body.club_name) {
                return res.status(200).json({resultCode: 1, message: "Не все поля заполнены"})
            }

            const decoded = jwt.verify(authToken, process.env.SECRET_JWT)

            const sqlCheckIsUserHaveClub = "SELECT * FROM club WHERE owner = ?"
            const data = [decoded.id]


            pool.query(sqlCheckIsUserHaveClub, data, async (error, result) => {
                if (error) return res.status(200).json({message: error, resultCode: 1})


                if (result.length === 0) {

                    // Смотрю есть ли уже клуб с таким именем
                    const sqlCheckRepeatName = "SELECT id FROM club WHERE name = ?"
                    const dataCheckRepeatName = [req.body.club_name]

                    pool.query(sqlCheckRepeatName, dataCheckRepeatName, async (error, result) => {
                        if (error) return res.status(200).json({message: error, resultCode: 1})

                        if (result.length === 0) {
                            const club_id = uuidv4()

                            const clubPrivacyStatus = req.body.privacy ? 'close' : 'open'

                            const sqlCreateClub = "INSERT INTO club (id, name, owner, privacy) VALUES (?, ?, ?, ?)"
                            const dataCreateClub = [club_id, req.body.club_name, decoded.id, clubPrivacyStatus]

                            pool.query(sqlCreateClub, dataCreateClub, async (error, result) => {
                                if (error) return res.status(200).json({message: error, resultCode: 1})

                                return res.status(201).json({
                                    resultCode: 0,
                                    club_id
                                })

                            })
                        } else {
                            return res.status(200).json({
                                resultCode: 1,
                                message: "Клуб с таким названием уже существует"
                            })
                        }
                    })

                } else {
                    return res.status(200).json({
                        resultCode: 1,
                        message: "У вас уже есть клуб"
                    })
                }
            })

        } else {
            res.status(401).json({resultCode: 1})
        }

    } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}


const getAllClubs = (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            const decoded = jwt.verify(authToken, process.env.SECRET_JWT)

            const sqlGetClubs = "SELECT * FROM club WHERE owner != ?"
            const data = [decoded.id]


            pool.query(sqlGetClubs, data, async (error, result) => {
                if (error) return res.status(200).json({message: error, resultCode: 1})

                if (result.length === 0) {
                    return res.status(200).json({resultCode: 1, message: "Клубы не найдены"})
                } else {
                    return res.status(200).json({
                        resultCode: 0,
                        clubs: result.length
                    })
                }
            })

        } else {
            res.status(401).json({resultCode: 1})
        }

    } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}


const joinToTheClub = (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            const decoded = jwt.verify(authToken, process.env.SECRET_JWT)

            if (!req.body.club_id) {
                return res.status(200).json({resultCode: 1, message: 'Не удалось найти клуб'})
            }

            const sqlFindThisThroughMyClub = "SELECT clubs FROM trainers WHERE id = ?"
            const dataFindThisThroughMyClub = [decoded.id]

            pool.query(sqlFindThisThroughMyClub, dataFindThisThroughMyClub, async (error, result) => {
                if (error) return res.status(200).json({message: error, resultCode: 1})


                // Если клубов нет
                if (!result[0].clubs) {
                    const resClubArr = JSON.stringify([req.body.club_id])

                    const sqlJoinToTheClub = "UPDATE trainers SET clubs = ? WHERE id = ?"
                    const dataJoinToTheClub = [resClubArr, decoded.id]

                    pool.query(sqlJoinToTheClub, dataJoinToTheClub, async (error, result) => {
                        if (error) return res.status(200).json({message: error, resultCode: 1})

                        return res.status(200).json({resultCode: 0})
                    })

                // Если уже состоит в каких то клубах
                } else if (result[0].clubs) {
                    // Ищем не состоит ли пользователь в этом клубе
                    const clubsParseArr = JSON.parse(result[0].clubs)

                    let isReturn = false

                    clubsParseArr.map(item => {
                        if (item === req.body.club_id) {
                            isReturn = true
                            return res.status(200).json({resultCode: 1, message: "Вы уже состоите в этом клубе"})
                        }
                    })

                    if (!isReturn) {

                        clubsParseArr.push(req.body.club_id)

                        const resClubArr = JSON.stringify(clubsParseArr)

                        const sqlJoinToTheClub = "UPDATE trainers SET clubs = ? WHERE id = ?"
                        const dataJoinToTheClub = [resClubArr, decoded.id]

                        pool.query(sqlJoinToTheClub, dataJoinToTheClub, async (error, result) => {
                            if (error) return res.status(200).json({message: error, resultCode: 1})

                            return res.status(200).json({resultCode: 0})
                        })
                    }
                }

            })

        } else {
            res.status(401).json({resultCode: 1})
        }

    } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}


const getWorkoutClub = (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            const decoded = jwt.verify(authToken, process.env.SECRET_JWT)

            const sqlGetClubs = "SELECT clubs FROM trainers WHERE id = ?"
            const data = [decoded.id]

            // Получаю id всех клубов, в которых состою
            pool.query(sqlGetClubs, data, async (error, result) => {
                if (error) return res.status(200).json({message: error, resultCode: 1})

                if (result[0].clubs) {
                    const allUserClubs = JSON.parse(result[0].clubs)


                    function getOwnerIdFromClubTable(arr, callback) {
                        const resultArray = [];
                        let pending = arr.length;
                        const sql2 = "SELECT owner FROM club WHERE id = ?"

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


                    function getWorkoutByTrainerId(arr, callback) {
                        const resultArray = [];
                        let pending = arr.length;
                        const sql2 = "SELECT * FROM workout WHERE trainer_id = ? AND is_club_workout = true"

                        for (let i = 0; i < pending; i++) {
                            const data2 = [arr[i].owner];

                            pool.query(sql2, data2, (error, result) => {
                                if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

                                resultArray.push(...result)
                                if (0 === --pending) {
                                    callback(resultArray)
                                }
                            })
                        }
                    }


                    getOwnerIdFromClubTable(allUserClubs, resultArr => {

                        getWorkoutByTrainerId(resultArr, returnArr => {
                            for (let i = 0; i < returnArr.length; i++) {
                                returnArr[i].workout = JSON.parse(returnArr[i].workout)
                            }

                            return res.status(200).json({result: returnArr, resultCode: 0})
                        })

                    })


                } else {
                    return res.status(200).json({resultCode: 0, message: 'Клубы не найдены', result: []})
                }
            })

        } else {
            res.status(401).json({resultCode: 1})
        }

    } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}


const findClub = (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            if (req.headers.search_name) {

                let replacement = `'${req.headers.search_name}%'`;

                const sqlFindByName = `SELECT id, name FROM club WHERE name LIKE ${replacement}`

                pool.query(sqlFindByName, (error, result) => {
                    if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

                    if (result.length === 0) {
                        return res.status(200).json({resultCode: 1, message: "Не удалось найти такой клуб"})
                    } else {
                        return res.status(200).json({resultCode: 0, result})
                    }
                })


            } else {
                return res.status(200).json({resultCode: 1, message: "Введите название"})
            }

        }

    } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}



const getAllMyClubs = (req, res, next) => {
    try {

        const authToken = req.headers.token;

        if (authToken) {

            const decoded = jwt.verify(authToken, process.env.SECRET_JWT)

            const sqlFindMyClubs = "SELECT clubs FROM trainers WHERE id = ?"
            const dataFind = [decoded.id]

            pool.query(sqlFindMyClubs, dataFind, (error, result) => {
                if (error) return res.status(400).json({message: "Products not found", resultCode: 1})

                if (result[0].clubs) {

                    const parseClub = JSON.parse(result[0].clubs)

                    return res.status(200).json({resultCode: 0, result: parseClub})

                } else {
                    return res.status(200).json({resultCode: 0, result: []})
                }
            })

        }

    } catch (err) {
        next(createError(400, 'Что-то пошло не так!'))
    }
}

module.exports = {
    getCreatedByUserClub,
    createClub,
    getAllClubs,
    joinToTheClub,
    getWorkoutClub,
    findClub,
    getAllMyClubs,
}
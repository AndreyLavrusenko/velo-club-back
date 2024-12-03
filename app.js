const express = require("express")
const cors = require("cors");

require('dotenv').config()

const app = express();


const authRoute = require("./routes/auth.js")
const workoutRoute = require("./routes/workout.js")
const clubRoute = require("./routes/club.js")

app.use(cors({credentials: true, origin: [process.env.CLIENT_URI]}))
app.use(express.json())



app.use('/auth', authRoute)

app.use('/workout', workoutRoute)

app.use('/club', clubRoute)


app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";

    return res.status(status).json({
        resultCode: 1,
        status,
        message,
    })
})

const PORT = process.env.PORT || 8080


app.listen(PORT, () => {
    console.log('Server start', PORT)
})

const express = require("express")
const cors = require("cors");

require('dotenv').config()

const app = express();


const authRoute = require("./routes/auth.js")
const workoutRoute = require("./routes/workout.js")
const clubRoute = require("./routes/club.js")

app.use(cors({credentials: true, origin: [process.env.CLIENT_URI], allowedHeaders: ['Content-Type', 'Authorization', 'workout_id', 'token'],}))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
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

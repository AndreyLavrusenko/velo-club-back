const express = require("express")

const cors = require("cors");

require('dotenv').config()

const app = express();

app.use(cors({credentials: true, origin: [process.env.CLIENT_URI]}))
app.use(express.json())

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